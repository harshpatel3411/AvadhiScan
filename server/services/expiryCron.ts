import cron from "node-cron";
import { User } from "../models/User";
import { Item } from "../models/Item";
import { sendBulkExpiryNotification } from "./email";


const CRON_SCHEDULE = process.env.EXPIRY_CRON_SCHEDULE || "0 9 * * *";
const NOTIFY_BEFORE_DAYS = Number(process.env.EXPIRY_NOTIFY_BEFORE_DAYS || 3);


//this is my main function for mail
export const startExpiryCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("⏰ Running expiry notification cron...");

    const now = new Date();
    const users = await User.find({ notificationsEnabled: true });

    for (const user of users) {
      const items = await Item.find({ userId: user._id });

      const expiringItems = items
        .map(item => {
          const expiryDate = new Date(item.expiryDate);
          const daysLeft = Math.ceil(
            (expiryDate.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return { item, daysLeft };
        })
        .filter(({ daysLeft }) => daysLeft > 0 && daysLeft <= 3)
        .map(({ item, daysLeft }) => ({
          name: item.name,
          expiryDate: new Date(item.expiryDate),
          daysLeft,
        }));

      if (expiringItems.length === 0) continue;

      await sendBulkExpiryNotification(user.email, expiringItems);
    }
  });
};








// this is my temp function for mail (for testing only,runs evrery minute)
// export const startExpiryCron = () => {
//   cron.schedule("* * * * *", async () => {
//     console.log("⏰ Running expiry notification cron...");

//     const now = new Date();
//     const users = await User.find({ notificationsEnabled: true });

//     for (const user of users) {
//       const items = await Item.find({ userId: user._id });

//       const expiringItems = items
//         .map(item => {
//           const expiryDate = new Date(item.expiryDate);
//           const daysLeft = Math.ceil(
//             (expiryDate.getTime() - now.getTime()) /
//               (1000 * 60 * 60 * 24)
//           );

//           return { item, daysLeft };
//         })
//         .filter(({ daysLeft }) => daysLeft > 0 && daysLeft <= 3)
//         .map(({ item, daysLeft }) => ({
//           name: item.name,
//           expiryDate: new Date(item.expiryDate),
//           daysLeft,
//         }));

//       if (expiringItems.length === 0) continue;

//       await sendBulkExpiryNotification(user.email, expiringItems);
//     }
//   });
// };
