const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai'); // Import OpenAI

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = process.env.PORT || 3001; // Use port from .env or default to 3001

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json({ limit: '50mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Also add limit for URL-encoded data if needed in the future

// Route for marketing asset generation (now async)
app.post('/api/generate-marketing-asset', async (req, res) => { // Make route async
  // Limit logging of potentially large image data
  console.log('Received request for:', { deviceType: req.body.deviceType, outputType: req.body.outputType });
  const { mockupImage, deviceType, outputType } = req.body;

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_key_here') {
    return res.status(500).json({ success: false, message: 'OpenAI API key not configured.' });
  }

  // --- Actual AI image generation logic --- 
  console.log(`Generating ${outputType} asset for ${deviceType}...`);

  // --- Prompt Engineering --- 
  // This is a CRUCIAL part. We need a good prompt to get good results.
  // We need to decide how to incorporate the 'mockupImage'. 
  // For DALL-E 3 (via images.generate), we primarily use text prompts.
  // Option 1: Describe the mockup (complex). 
  // Option 2: Generate a background/scene and combine it with the mockup later (requires more processing). 
  // Option 3: If using a model that accepts image inputs (like gpt-4-vision-preview for analysis or potentially a different image generation method), the approach changes.
  
  // For now, let's create a simple text prompt focusing on the desired output format and style,
  // assuming the frontend will overlay the actual device mockup onto this generated background later.
  // This is a simplification and likely needs refinement.

  let prompt = `Create a professional marketing background suitable for an '${outputType}' post. The main subject is a screenshot displayed on an '${deviceType}' device. The background should be clean, modern, and visually appealing, perhaps with subtle gradients or abstract shapes. Do not include the device itself in the generated image, only the background scene.`;

  if (outputType === 'instagram') {
    prompt += ` The style should be vibrant and eye-catching for social media. Aspect ratio 1:1.`;
  } else if (outputType === 'appstore') {
    prompt += ` The style should be professional and clear, suitable for App Store presentation. Aspect ratio roughly 9:16.`;
  }

  // --- Determine image size based on output type --- 
  let size = "1024x1024"; // Default size
  if (outputType === 'instagram') {
    size = "1024x1024";
  } else if (outputType === 'appstore') {
    size = "1024x1792"; // DALL-E 3 supported size close to 9:16
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3", // Or "dall-e-2" if preferred/needed
      prompt: prompt,
      n: 1, // Generate one image
      size: size, 
      // response_format: 'url' // Default is URL
    });

    console.log("OpenAI API Response:", response);
    const generatedImageUrl = response.data[0].url;

    if (!generatedImageUrl) {
      throw new Error('OpenAI response did not contain an image URL.');
    }

    res.json({ success: true, imageUrl: generatedImageUrl });

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    let errorMessage = "Failed to generate image.";
    if (error.response) {
      console.error('OpenAI Error Status:', error.response.status);
      console.error('OpenAI Error Data:', error.response.data);
      errorMessage = error.response.data?.error?.message || errorMessage;
    } else {
      console.error('OpenAI Error Message:', error.message);
      errorMessage = error.message || errorMessage;
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('MockupMagic Backend Server is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 