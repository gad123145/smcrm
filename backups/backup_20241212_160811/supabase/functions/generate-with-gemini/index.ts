import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request
    if (!req.body) {
      throw new Error('Request body is required');
    }

    const { prompt } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Initialize Google AI
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log('Generating response for prompt:', prompt);

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    console.log('Generated response successfully');

    return new Response(
      JSON.stringify({ generatedText }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-with-gemini function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while generating text',
        details: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: error.message.includes('not configured') ? 503 : 400
      }
    );
  }
});