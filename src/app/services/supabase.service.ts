import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://sudefkjvakmdgcvyzjao.supabase.co', // replace with your Project URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1ZGVma2p2YWttZGdjdnl6amFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NDU4OTMsImV4cCI6MjA2NzUyMTg5M30.jfRS38VFOHAM7bXts8ZVSYebEiNTmdyPaRYmAMnAZTc' // replace with your anon key
    );
  }

  addServer(server: {
    full_name: string;
    grade: number;
    email?: string;
    phone_number?: string;
    server_since?: string; // e.g., '2025-07-08'
  }) {
    return this.supabase
      .from('servers')
      .insert([server]);
  }
  

  getLeaderboard() {
    return this.supabase
      .from('leaderboard')
      .select('server_id, points, servers (full_name)');
  }

  updatePoints(serverId: string, points: number) {
    return this.supabase
      .from('leaderboard')
      .update({ points })
      .eq('server_id', serverId);
  }

  listenToLeaderboard(callback: Function) {
    this.supabase
      .channel('custom-leaderboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  }
}
