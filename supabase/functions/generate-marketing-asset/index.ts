
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts' // Assuming shared CORS headers

console.log("Hello from Functions!")

// Main function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Retrieve OpenAI API key from secrets
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('Missing environment variable OPENAI_API_KEY')
    }

    // Parse request body
    const { mockupImage, deviceType, outputType } = await req.json()
    console.log(`Generating ${outputType} asset for ${deviceType} using gpt-image-1...`);

    if (!mockupImage) {
      throw new Error('No screenshot provided. Please upload a screenshot first.')
    }

    // --- Enhanced Prompt Engineering for Real-World Contextual Mockups ---
    let prompt = '';
    let environmentContext = '';
    let deviceDescription = '';

    // Define device-specific descriptions
    switch (deviceType) {
      case 'iphone':
        deviceDescription = "iPhone 14 Pro";
        break;
      case 'android':
        deviceDescription = "modern Android smartphone";
        break;
      case 'ipad':
        deviceDescription = "iPad Pro";
        break;
      case 'macbook':
        deviceDescription = "MacBook Pro laptop";
        break;
      default:
        deviceDescription = "smartphone";
    }

    // Context-specific environments based on output type
    if (outputType === 'instagram') {
      environmentContext = `Create a photorealistic marketing image featuring a ${deviceDescription} being held in someone's hands in a trendy coffee shop. The environment should be modern with warm lighting, coffee cups, and a laptop visible in the background. The device should be showing the app interface clearly visible on its screen. The scene should look professional and suitable for Instagram.`;
    } else if (outputType === 'appstore') {
      environmentContext = `Create a photorealistic marketing image featuring a ${deviceDescription} on a clean, minimalist desk with a plant, notebook, and stylish desk lamp. Natural light should be streaming in from a window. The device should be the main focus with the app interface clearly visible on its screen. The scene should look professional and suitable for App Store promotional material.`;
    }

    // Build a more detailed prompt for contextual mockups
    prompt = `${environmentContext} The device screen should prominently display the app interface. The image should be high-quality and photo-realistic, not illustrated. Make sure the app interface is clearly visible on the device screen as a central part of the image. The scene should have professional lighting and composition for marketing purposes.`;

    // --- Determine image size based on output type ---
    let size = "1024x1024"; // Default size
    if (outputType === 'instagram') {
      size = "1024x1024"; // Square format
    } else if (outputType === 'appstore') {
      size = "1024x1792"; // Portrait format
    }

    // --- Call OpenAI API using fetch with gpt-image-1 model ---
    const openaiUrl = 'https://api.openai.com/v1/images/generations';
    const openaiPayload = {
      model: "gpt-image-1", // Using gpt-image-1 instead of dall-e-3
      prompt: prompt,
      n: 1,
      size: size,
      quality: "high", // Updated from "hd" to "high" which is supported
    };

    const openaiResponse = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify(openaiPayload),
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.json();
      console.error("OpenAI API Error:", errorBody);
      throw new Error(errorBody?.error?.message || `OpenAI API request failed with status ${openaiResponse.status}`);
    }

    const responseData = await openaiResponse.json();
    const generatedImageUrl = responseData.data[0].url;

    if (!generatedImageUrl) {
      throw new Error('OpenAI response did not contain an image URL.');
    }

    // Return the generated image URL and the revisedPrompt if available
    const revisedPrompt = responseData.data[0].revised_prompt;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: generatedImageUrl,
        revisedPrompt: revisedPrompt || null 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-marketing-asset' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
