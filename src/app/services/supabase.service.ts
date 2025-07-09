import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment';

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
