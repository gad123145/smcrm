import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EntityData {
  id: string;
  type: 'company' | 'project';
  name: string;
  description?: string;
  [key: string]: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { entity } = await req.json() as { entity: EntityData }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate analysis using the entity data
    const analysis = {
      name: entity.name,
      type: entity.type,
      summary: `${entity.type === 'company' ? 'شركة' : 'مشروع'} ${entity.name}`,
      description: entity.description || '',
      details: Object.entries(entity)
        .filter(([key]) => !['id', 'type', 'name', 'description'].includes(key))
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {} as Record<string, any>),
      analyzed_at: new Date().toISOString()
    }

    // Store analysis in the appropriate table
    if (entity.type === 'company') {
      await supabaseClient
        .from('ai_company_insights')
        .upsert({
          company_id: entity.id,
          analysis_data: analysis,
          last_analysis: new Date().toISOString()
        })
    } else {
      await supabaseClient
        .from('ai_project_insights')
        .upsert({
          project_id: entity.id,
          analysis_data: analysis,
          last_analysis: new Date().toISOString()
        })
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})