import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get all users from auth.users
    const { data: { users }, error: usersError } = await supabaseClient.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw profilesError
    }

    // Create a map of profiles by user ID
    const profilesMap = new Map(profiles?.map(profile => [profile.id, profile]))

    // For each user without a profile, create one
    for (const user of users) {
      if (!profilesMap.has(user.id)) {
        const { error: insertError } = await supabaseClient
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.email?.split('@')[0] || 'Unknown',
            role: 'employee',
            status: 'active'
          })
        
        if (insertError) {
          console.error('Error creating profile for user:', user.id, insertError)
        }
      }
    }

    // Get updated profiles after creating missing ones
    const { data: updatedProfiles } = await supabaseClient
      .from('profiles')
      .select('*')

    // Create updated map
    const updatedProfilesMap = new Map(updatedProfiles?.map(profile => [profile.id, profile]))

    // Combine users with their profiles
    const combinedUsers = users.map(user => {
      const profile = updatedProfilesMap.get(user.id)
      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.email?.split('@')[0] || 'Unknown',
        role: profile?.role || 'employee',
        status: profile?.status || 'active',
        avatar: profile?.avatar || null,
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at || user.updated_at,
        company_id: profile?.company_id || null,
        notification_settings: profile?.notification_settings || null
      }
    })

    return new Response(
      JSON.stringify(combinedUsers),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in list-users function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})