import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER || 'noreply@expirytracker.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'fallback-password';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});




export const sendExpiryNotification = async (
  to: string,
  itemName: string,
  expiryDate: Date,
  daysUntilExpiry: number
) => {
  const subject = daysUntilExpiry <= 0 
    ? `🔴 ${itemName} has expired!`
    : `⚠️ ${itemName} expires in ${daysUntilExpiry} day(s)`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366F1;">Expiry Tracker Notification</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: ${daysUntilExpiry <= 0 ? '#EF4444' : '#F59E0B'};">
          ${subject}
        </h3>
        <p><strong>Item:</strong> ${itemName}</p>
        <p><strong>Expiry Date:</strong> ${expiryDate.toLocaleDateString()}</p>
        ${daysUntilExpiry <= 0 
          ? '<p style="color: #EF4444;"><strong>This item has expired and should be checked immediately.</strong></p>'
          : `<p style="color: #F59E0B;"><strong>This item will expire in ${daysUntilExpiry} day(s).</strong></p>`
        }
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        This is an automated notification from Expiry Tracker. You can disable these notifications in your settings.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Expiry Tracker" <${EMAIL_USER}>`,
      to,
      subject,    
      html,
    });
    console.log(`Email sent to ${to} for item: ${itemName}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export const checkAndSendNotifications = async (storage: any) => {
  try {
    // This would be called by a cron job
    // Get all users and check their items for expiry
    console.log('Checking for expiring items...');
  } catch (error) {
    console.error('Error checking notifications:', error);
  }
};


interface ExpiringItem {
  name: string;
  expiryDate: Date;
  daysLeft: number;
}

export const sendBulkExpiryNotification = async (
  to: string,
  items: ExpiringItem[]
) => {
  const itemListHtml = items
    .map(
      item => `
        <li>
          <strong>${item.name}</strong> — expires in 
          <strong>${item.daysLeft} day${item.daysLeft > 1 ? "s" : ""}</strong>
          (on ${item.expiryDate.toLocaleDateString()})
        </li>
      `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366F1;">Expiry Tracker Notification</h2>
      <p>The following items will expire within the next <strong>3 days</strong>:</p>
      <ul>${itemListHtml}</ul>
      <p style="color: #6b7280; font-size: 14px;">
        This is an automated notification. You can disable these notifications in settings.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Expiry Tracker" <${EMAIL_USER}>`,
      to,
      subject: "⏰ Items Expiring Soon (Next 3 Days)",
      html,
    });

    console.log(`Bulk expiry email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send bulk expiry email:", error);
    throw error;
  }
};
