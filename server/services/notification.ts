import { storage } from '../storage';
import { sendExpiryNotification } from './email';
import { User } from '../models/User';
import { Item } from '../models/Item';

export class NotificationService {
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    // Check for expiring items every hour
    this.intervalId = setInterval(async () => {
      await this.checkAndSendNotifications();
    }, 60 * 60 * 1000); // 1 hour

    console.log('Notification service started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Notification service stopped');
    }
  }

  async checkAndSendNotifications() {
    try {
      console.log('Checking for expiring items...');
      
      const now = new Date();
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      
      // Find items expiring in the next 2 days
      const expiringItems = await Item.find({
        expiryDate: { $gte: now, $lte: twoDaysFromNow }
      }).populate('userId', 'email username notificationsEnabled');
      
      console.log(`Found ${expiringItems.length} items expiring in the next 2 days`);
      
      for (const item of expiringItems) {
        const user = item.userId as any;
        
        // Only send notification if user has notifications enabled
        if (user && user.notificationsEnabled && user.email) {
          await this.sendNotificationForItem(user.email, item.name, item.expiryDate);
        }
      }
      
      console.log('Notification check completed');
    } catch (error) {
      console.error('Error in notification service:', error);
    }
  }

  async sendNotificationForItem(userEmail: string, itemName: string, expiryDate: Date) {
    try {
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      await sendExpiryNotification(userEmail, itemName, expiryDate, daysUntilExpiry);
      console.log(`Notification sent to ${userEmail} for item: ${itemName}`);
    } catch (error) {
      console.error(`Failed to send notification for ${itemName}:`, error);
    }
  }
}

export const notificationService = new NotificationService();