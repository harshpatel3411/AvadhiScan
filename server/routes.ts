import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from 'bcryptjs';
import { storage } from "./storage";
import { authMiddleware, generateToken, AuthRequest } from "./middleware/auth";
import { insertUserSchema, loginSchema, insertItemSchema } from "@shared/schema";
import { sendExpiryNotification } from "./services/email";
import { lookupBarcode } from "./services/barcode";
import { User } from "./models/User";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ProductInfo } from "../server/models/ProductInfo";
import { Item } from "./models/Item";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {

      const userData = insertUserSchema.parse(req.body);
      console.log(userData);
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        user: { id: user._id, username: user.username, email: user.email },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  // JUST Testing -----------------------------------------------------------------------------------------------------------------
  app.get("/test-email", async (req, res) => {
    try {
      const transporter = nodemailer.createTransport(
        {
          host: process.env.EMAIL_HOST,   // e.g. smtp.gmail.com
          port: Number(process.env.EMAIL_PORT), // 587
          secure: false,                  // true for 465
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        } as SMTPTransport.Options // ✅ cast fixes the TS error
      );


      // testing completed

      const info = await transporter.sendMail({
        from: `"Expiry Tracker" <${process.env.EMAIL_USER}>`,
        to: "patelprincy4480@gmail.com",
        subject: "Test Email ✅",
        text: "If you are seeing this, your email setup works perfectly!",
      });

      console.log("Message sent: %s", info.messageId);
      res.json({ success: true, message: "Test email sent!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });



  // hit this api to send test mail->http://localhost:8001/test-perfect-email-template

  app.get("/test-perfect-email-template", async (req, res) => {


    try {
      await sendExpiryNotification(
        "harshpatel63540@gmail.com", // <-- put your test email
        "Milk",
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // expires in 2 days
        2
      );
      res.send("✅ Test email sent!");
    } catch (error) {
      res.status(500).send("❌ Failed to send test email");
    }
  });



















  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        user: { id: user._id, username: user.username, email: user.email },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/me", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.userId).select("-password");
      console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ id: user._id, username: user.username, email: user.email });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Item routes
  app.get("/api/items", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const items = await storage.getItems(req.userId!);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });


  // Real route
  // app.post("/api/items", authMiddleware, async (req: AuthRequest, res) => {
  //   try {
  //     const itemData = insertItemSchema.parse(req.body);
  //     const item = await storage.createItem({ ...itemData, userId: req.userId! });
  //     res.status(201).json(item);
  //   } catch (error: any) {
  //     res.status(400).json({ message: error.message || "Failed to create item" });
  //   }
  // });













  //here is chatgpt route for implimenting scanning feature using barcode package
  //   app.post("/api/items", authMiddleware, async (req: AuthRequest, res) => {
  //     try {
  //       const itemData = insertItemSchema.parse(req.body);
  //       await ProductInfo.findOneAndUpdate(
  //   { barcode: itemData.barcode },
  //   {
  //     barcode: itemData.barcode,
  //     name: itemData.name,
  //     brand: itemData.brand,
  //     category: itemData.category
  //   },
  //   { upsert: true, new: true }  // <-- ensures product is saved only once
  // );

  // // Existing item creation (untouched)
  // const item = await storage.createItem({ ...itemData, userId: req.userId! });

  // res.status(201).json(item);
  //     } catch (error: any) {
  //       res.status(400).json({ message: error.message || "Failed to create item" });
  //     }
  //   });
  app.post("/api/items", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);

      // Save item
      const item = await storage.createItem({ ...itemData, userId: req.userId! });

      // ⭐ AFTER SAVING ITEM → Save product metadata
      if (itemData.barcode) {
        await ProductInfo.findOneAndUpdate(
          { barcode: itemData.barcode },
          {
            barcode: itemData.barcode,
            name: itemData.name,
            brand: itemData.brand,
            category: itemData.category,
          },
          { upsert: true }  // create if not exists
        );
      }

      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create item" });
    }
  });



















  app.put("/api/items/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const updates = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, req.userId!, updates);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteItem(id, req.userId!);

      if (!success) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete item" });
    }
  });




  app.get("/api/dashboard/stats", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const items = await storage.getItems(req.userId!);
      const now = new Date();

      const stats = {
        totalItems: items.length,
        expiringSoon: items.filter(item => {
          const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
        }).length,
        expired: items.filter(item => new Date(item.expiryDate) <= now).length,
        safe: items.filter(item => {
          const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry > 7;
        }).length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.post("/api/barcode/lookup", authMiddleware, async (req, res) => {
    try {
      const { barcode } = req.body;
      if (!barcode) {
        return res.status(400).json({ message: "Barcode is required" });
      }

      const product = await lookupBarcode(barcode);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to lookup barcode" });
    }
  });

  app.get("/api/items/export", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const items = await storage.getItems(req.userId!);

      // Create CSV content
      const headers = ['Name', 'Brand', 'Category', 'Quantity', 'Expiry Date', 'Status', 'Notes'];
      const csvContent = [
        headers.join(','),
        ...items.map(item => {
          const now = new Date();
          const expiryDate = new Date(item.expiryDate);
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          let status = 'Safe';
          if (daysUntilExpiry <= 0) status = 'Expired';
          else if (daysUntilExpiry <= 7) status = 'Expiring Soon';

          return [
            `"${item.name}"`,
            `"${item.brand || ''}"`,
            `"${item.category}"`,
            item.quantity,
            expiryDate.toLocaleDateString(),
            status,
            `"${item.notes || ''}"`
          ].join(',');
        })
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="expiry-tracker-export.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  // Settings routes
  app.put("/api/settings/notifications", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { notificationsEnabled } = req.body;

      const user = await storage.updateUser(req.userId!, { notificationsEnabled });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Notification settings updated", notificationsEnabled });
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });




  // });
app.get("/api/analytics/summary", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const items = await Item.find({ userId });

    const now = new Date();

    let expired = 0;
    let expiringSoon = 0;
    let safe = 0;
    let totalWasteCost = 0;

    const categoryCounts: Record<string, number> = {};
    const monthlyExpired: Record<string, number> = {};

    items.forEach((item) => {
      const expiryDate = new Date(item.expiryDate);
      const daysLeft = Math.ceil(
        (expiryDate.getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      // ✅ FIXED (ONLY ONE BLOCK)
      if (daysLeft < 0) {
        expired++;

        totalWasteCost += (item.price || 0) * (item.quantity || 1);

        const monthKey = expiryDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        monthlyExpired[monthKey] =
          (monthlyExpired[monthKey] || 0) + 1;
      } 
      else if (daysLeft <= 7) {
        expiringSoon++;
      } 
      else {
        safe++;
      }

      // Category count
      categoryCounts[item.category] =
        (categoryCounts[item.category] || 0) + 1;
    });

    res.json({
      total: items.length,
      expired,
      expiringSoon,
      safe,
      totalWasteCost,
      categoryCounts,
      monthlyExpired,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Analytics error" });
  }
});

  // tring to impliment scanning feature using pacakge 
  app.get("/api/products/:barcode", async (req, res) => {
    const { barcode } = req.params;

    const product = await ProductInfo.findOne({ barcode });

    if (!product) {
      return res.json({ exists: false });  // <-- indicate no product found
    }

    return res.json({
      exists: true,
      product
    });
  });



  const httpServer = createServer(app);
  return httpServer;
}




