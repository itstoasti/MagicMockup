# OpenAI Mockup Generator Edge Function

This Supabase Edge Function integrates with OpenAI's Image API (gpt-image-1 model) to generate real-life scene mockups with devices displaying the user's app screens.

## Deployment

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Set the required secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-api-key
   ```

5. Deploy the function:
   ```bash
   supabase functions deploy generate-openai-mockup --no-verify-jwt
   ```

## Environment Variables

The function requires the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `SUPABASE_URL`: Set automatically by Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Set automatically by Supabase

## Storage Bucket

Make sure to create a public storage bucket named `mockups` in your Supabase project with appropriate permissions.

## Function Usage

This function is called from the frontend with the following parameters:

```typescript
{
  mockupImage: string, // Base64 encoded PNG image of the device mockup
  deviceType: string,  // Type of device (e.g. "iPhone 15 Pro")
  userPrompt: string,  // User's description of the scene
  model: string        // OpenAI model name (should be "gpt-image-1")
}
```

The function returns:

```typescript
{
  success: boolean,
  imageUrl: string,     // URL of the generated image 
  revisedPrompt: string // The enhanced prompt sent to OpenAI
}
``` 