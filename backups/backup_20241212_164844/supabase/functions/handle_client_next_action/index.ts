import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) throw authError

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user.id)
      .single()

    const isArabic = profile?.language === 'ar'

    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', req.params.client_id)
      .single()

    if (client?.next_action_date && new Date(client.next_action_date) > new Date()) {
      const title = isArabic ? 'تذكير بإجراء للعميل' : 'Client Action Reminder'
      const message = isArabic 
        ? `لديك إجراء مستحق للعميل: ${client.name} - ${client.next_action_type || ''}`
        : `You have a pending action for client: ${client.name} - ${client.next_action_type || ''}`

      await supabase
        .from('notifications')
        .insert({
          user_id: client.assigned_to || client.user_id,
          title,
          message,
          type: 'client_action'
        })
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})