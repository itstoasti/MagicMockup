import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RequestBody {
  mockupImage: string;
  deviceType: string;
  userPrompt: string;
  model: string;
}

serve(async (req: Request) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // Parse request body
    const { mockupImage, deviceType, userPrompt, model } = await req.json() as RequestBody;

    // Validate inputs
    if (!mockupImage || !deviceType || !userPrompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: mockupImage, deviceType, or userPrompt' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Validate mockup image size
    const base64Data = mockupImage.replace(/^data:image\/\w+;base64,/, '');
    const imageSizeInBytes = Math.ceil((base64Data.length * 3) / 4);
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit

    if (imageSizeInBytes > maxSizeInBytes) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Mockup image is too large. Maximum size is 10MB.' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Process the mockup image (base64)
    // Convert base64 to blob for upload to Supabase Storage
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Upload mockup image to Supabase Storage
    const filename = `mockup-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('mockups')
      .upload(filename, binaryData, {
        contentType: 'image/png',
        cacheControl: '3600',
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to upload reference image' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }
    
    // Get the public URL of the uploaded image
    const { data: { publicUrl } } = supabase
      .storage
      .from('mockups')
      .getPublicUrl(filename);

    // Construct the prompt for OpenAI
    const enhancedPrompt = `Create a photorealistic image of a ${deviceType} in this real-life scenario: ${userPrompt}. The device should be the main focus of the image, with its screen clearly visible and displaying the app interface. The scene should look natural and professional, with appropriate lighting and composition. The device should appear to be naturally integrated into the environment.`;
    
    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-image-1',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',  // Use natural style for more realistic images
        response_format: 'url',
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      
      // Clean up the uploaded mockup image on error
      try {
        await supabase
          .storage
          .from('mockups')
          .remove([filename]);
      } catch (cleanupError) {
        console.error('Error cleaning up mockup image:', cleanupError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API error', 
          details: errorData 
        }),
        { 
          status: openaiResponse.status, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    const openaiData = await openaiResponse.json();
    
    // Clean up the uploaded mockup image after successful generation
    try {
      await supabase
        .storage
        .from('mockups')
        .remove([filename]);
    } catch (cleanupError) {
      console.error('Error cleaning up mockup image:', cleanupError);
    }
    
    // Return the response
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: openaiData.data[0].url,
        revisedPrompt: enhancedPrompt,
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Unexpected error occurred' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
}); 