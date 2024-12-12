import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { users }, error: authError } = await supabaseClient.auth.admin.listUsers()
    
    if (authError) throw authError

    // Create an object with user IDs as keys and their active session count as values
    const activeSessions = users.reduce((acc, user) => {
      if (user.last_sign_in_at) {
        // Consider a session active if the last sign in was within the last 24 hours
        const lastSignIn = new Date(user.last_sign_in_at)
        const isActive = (new Date().getTime() - lastSignIn.getTime()) < 24 * 60 * 60 * 1000
        acc[user.id] = isActive ? 1 : 0
      } else {
        acc[user.id] = 0
      }
      return acc
    }, {})

    return new Response(
      JSON.stringify(activeSessions),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})