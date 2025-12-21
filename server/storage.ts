import { User } from './models/User';
import { Item } from './models/Item';
import { type InsertUser, type InsertItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: InsertUser): Promise<any>;
  updateUser(id: string, updates: Partial<any>): Promise<any | undefined>;

  // Item methods
  getItems(userId: string): Promise<any[]>;
  getItem(id: string, userId: string): Promise<any | undefined>;
  createItem(item: InsertItem & { userId: string }): Promise<any>;
  updateItem(id: string, userId: string, updates: Partial<InsertItem>): Promise<any | undefined>;
  deleteItem(id: string, userId: string): Promise<boolean>;
  getItemsByCategory(userId: string, category: string): Promise<any[]>;
  getExpiringItems(userId: string, days: number): Promise<any[]>;
  getExpiredItems(userId: string): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<any | undefined> {
    return await User.findById(id).lean();
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    return await User.findOne({ email }).lean();
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return await User.findOne({ username }).lean();
  }

  async createUser(insertUser: InsertUser): Promise<any> {
    const user = new User(insertUser);
    return await user.save();
  }

  async updateUser(id: string, updates: Partial<any>): Promise<any | undefined> {
    return await User.findByIdAndUpdate(id, updates, { new: true }).lean();
  }

  // Item methods
  async getItems(userId: string): Promise<any[]> {
    return await Item.find({ userId }).lean();
  }

  async getItem(id: string, userId: string): Promise<any | undefined> {
    return await Item.findOne({ _id: id, userId }).lean();
  }

  async createItem(itemData: InsertItem & { userId: string }): Promise<any> {
    const item = new Item(itemData);
    return await item.save();
  }

  async updateItem(id: string, userId: string, updates: Partial<InsertItem>): Promise<any | undefined> {
    return await Item.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    ).lean();
  }

  async deleteItem(id: string, userId: string): Promise<boolean> {
    const result = await Item.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async getItemsByCategory(userId: string, category: string): Promise<any[]> {
    return await Item.find({ userId, category }).lean();
  }

  async getExpiringItems(userId: string, days: number): Promise<any[]> {
    const now = new Date();
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return await Item.find({
      userId,
      expiryDate: { $lte: threshold, $gt: now }
    }).lean();
  }

  async getExpiredItems(userId: string): Promise<any[]> {
    const now = new Date();
    
    return await Item.find({
      userId,
      expiryDate: { $lte: now }
    }).lean();
  }
}

export const storage = new MongoStorage();