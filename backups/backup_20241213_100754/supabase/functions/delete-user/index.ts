import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Database } from './database.ts';
import { corsHeaders } from './types.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      console.error('No user ID provided');
      return new Response(
        JSON.stringify({ error: 'يجب توفير معرف المستخدم' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('Starting deletion process for user:', userId);
    const db = new Database();

    try {
      // Delete data in sequence to avoid foreign key conflicts
      await db.deleteIndependentData(userId);
      console.log('Deleted independent data');
      
      await db.deleteChatData(userId);
      console.log('Deleted chat data');
      
      await db.deleteUserContent(userId);
      console.log('Deleted user content');
      
      await db.deleteProfile(userId);
      console.log('Deleted user profile');
      
      await db.deleteAuthUser(userId);
      console.log('Deleted auth user');

      return new Response(
        JSON.stringify({ success: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );

    } catch (error) {
      console.error('Error in deletion process:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'خطأ في حذف المستخدم', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});