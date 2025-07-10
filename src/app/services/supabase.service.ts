import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  addServer(server: {
    full_name: string;
    grade: number;
    email?: string;
    phone_number?: string;
    // server_since?: string; // e.g., '2025-07-08'
  }) {
    return this.supabase
      .from('servers')
      .insert([server])
      .select();
  }

  getServers() {
    return this.supabase
      .from('servers')
      .select('*');
  }

  deleteServer(serverId: string) {
    return this.supabase
      .from('servers')
      .delete()
      .eq('id', serverId);
  }

  getLeaderboard() {
    return this.supabase
      .from('leaderboard')
      .select('server_id, points, servers (full_name)');
  }

  updatePoints(serverId: string, points: number) {
    return this.supabase
      .from('servers')
      .update({ points })
      .eq('id', serverId);
  }

  listenToLeaderboard(callback: Function) {
    return this.supabase
      .channel('custom-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        (payload) => {
          console.log('Leaderboard change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();
  }

  listenToServers(callback: Function) {
    return this.supabase
      .channel('custom-servers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'servers' },
        (payload) => {
          console.log('Servers change detected:', payload);
          callback(payload);
        }
      )
      .subscribe();
  }

  async uploadHeroImage(file: File) {
    try {
      // Convert file to base64 and store in localStorage as fallback
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const base64Data = await base64Promise;
      localStorage.setItem('heroImage', base64Data);
      
      return base64Data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please check your file and try again.');
    }
  }

  async saveHeroImageUrl(imageUrl: string) {
    const { error } = await this.supabase
      .from('settings')
      .upsert({ key: 'hero_image', value: imageUrl });

    if (error) {
      throw error;
    }
  }

  async getHeroImage() {
    try {
      // Try to get from localStorage first
      const localImage = localStorage.getItem('heroImage');
      if (localImage) {
        return localImage;
      }
      return null;
    } catch (error) {
      console.error('Error getting hero image:', error);
      return null;
    }
  }
}
