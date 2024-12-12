import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

export class Database {
  private supabase;

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  async deleteIndependentData(userId: string) {
    const tables = [
      'user_permissions',
      'messenger_stats',
      'whatsapp_stats',
      'ai_conversations',
      'ai_reminders',
      'notifications'
    ];

    for (const table of tables) {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.warn(`Warning: Error deleting from ${table}:`, error);
      }
    }
  }

  async deleteChatData(userId: string) {
    // First delete reactions and comments
    const { error: reactionsError } = await this.supabase
      .from('chat_reactions')
      .delete()
      .eq('user_id', userId);
    
    if (reactionsError) {
      console.warn('Warning: Error deleting chat reactions:', reactionsError);
    }

    const { error: commentsError } = await this.supabase
      .from('chat_comments')
      .delete()
      .eq('user_id', userId);
    
    if (commentsError) {
      console.warn('Warning: Error deleting chat comments:', commentsError);
    }

    // Then delete messages
    const { error: messagesError } = await this.supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);
    
    if (messagesError) {
      console.warn('Warning: Error deleting chat messages:', messagesError);
    }
  }

  async deleteUserContent(userId: string) {
    // First update references to this user
    const { error: updateClientsError } = await this.supabase
      .from('clients')
      .update({ assigned_to: null })
      .eq('assigned_to', userId);

    if (updateClientsError) {
      console.warn('Warning: Error updating client assignments:', updateClientsError);
    }

    const { error: updateTasksError } = await this.supabase
      .from('tasks')
      .update({ assigned_to: null })
      .eq('assigned_to', userId);

    if (updateTasksError) {
      console.warn('Warning: Error updating task assignments:', updateTasksError);
    }

    // Delete tasks created by user first
    const { error: tasksError } = await this.supabase
      .from('tasks')
      .delete()
      .eq('created_by', userId);

    if (tasksError) {
      console.warn('Warning: Error deleting tasks:', tasksError);
    }

    // Delete client actions
    const { error: actionsError } = await this.supabase
      .from('client_actions')
      .delete()
      .eq('created_by', userId);

    if (actionsError) {
      console.warn('Warning: Error deleting client actions:', actionsError);
    }

    // Then delete owned content
    const contentTables = [
      'clients',
      'projects',
      'companies'
    ];

    for (const table of contentTables) {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.warn(`Warning: Error deleting from ${table}:`, error);
      }
    }
  }

  async deleteProfile(userId: string) {
    const { error: profileError } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      throw new Error(`Error deleting profile: ${profileError.message}`);
    }
  }

  async deleteAuthUser(userId: string) {
    const { error: deleteError } = await this.supabase.auth.admin.deleteUser(
      userId
    );

    if (deleteError) {
      throw new Error(`Error deleting auth user: ${deleteError.message}`);
    }
  }
}