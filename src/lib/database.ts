import { supabase } from "@/integrations/supabase/client";
import { MongoClient, Db, ObjectId } from 'mongodb';

// Database types
export type DatabaseType = 'supabase' | 'mongodb';

// Database interface
export interface DatabaseAdapter {
  // Auth methods
  signIn(email: string, password: string): Promise<any>;
  signUp(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<any>;

  // Trade methods
  createTrade(trade: any): Promise<any>;
  getTrades(userId: string): Promise<any[]>;
  deleteTrade(id: string): Promise<void>;
  updateTrade?(id: string, updates: any): Promise<void>;
}

// Supabase adapter
export class SupabaseAdapter implements DatabaseAdapter {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async createTrade(trade: any) {
    const { data, error } = await supabase.from("trades").insert([trade]).select();
    if (error) throw error;
    return data;
  }

  async getTrades(userId: string) {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .order("executed_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async deleteTrade(id: string) {
    const { error } = await supabase.from("trades").delete().eq("id", id);
    if (error) throw error;
  }

  async updateTrade(id: string, updates: any) {
    const { error } = await supabase.from("trades").update(updates).eq("id", id);
    if (error) throw error;
  }
}

// Simple session store for MongoDB (in production, use proper session management)
let currentUser: any = null;

// MongoDB adapter - Currently disabled for browser compatibility
// MongoDB driver cannot run in browser environment
// TODO: Implement via API or use MongoDB Atlas Data API
export class MongoDBAdapter implements DatabaseAdapter {
  async signIn(email: string, password: string) {
    throw new Error("MongoDB integration requires backend API. Please use Supabase for now.");
  }

  async signUp(email: string, password: string) {
    throw new Error("MongoDB integration requires backend API. Please use Supabase for now.");
  }

  async signOut() {
    currentUser = null;
  }

  async getCurrentUser() {
    return currentUser;
  }

  async createTrade(trade: any) {
    throw new Error("MongoDB integration requires backend API. Please use Supabase for now.");
  }

  async getTrades(userId: string) {
    return [];
  }

  async deleteTrade(id: string) {
    throw new Error("MongoDB integration requires backend API. Please use Supabase for now.");
  }

  async updateTrade(id: string, updates: any) {
    throw new Error("MongoDB integration requires backend API. Please use Supabase for now.");
  }
}

// Database manager
export class DatabaseManager {
  private static instance: DatabaseManager;
  private currentAdapter: DatabaseAdapter;
  private currentType: DatabaseType = 'supabase';

  private constructor() {
    this.currentAdapter = new SupabaseAdapter();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  getAdapter(): DatabaseAdapter {
    return this.currentAdapter;
  }

  getCurrentType(): DatabaseType {
    return this.currentType;
  }

  async switchDatabase(type: DatabaseType) {
    if (type === this.currentType) return;

    if (type === 'mongodb') {
      this.currentAdapter = new MongoDBAdapter();
    } else {
      this.currentAdapter = new SupabaseAdapter();
    }

    this.currentType = type;
    console.log(`Switched to ${type} database`);
  }
}

export const dbManager = DatabaseManager.getInstance();
