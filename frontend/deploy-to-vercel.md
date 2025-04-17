# Deploying the Frontend to Vercel

Follow these steps to deploy your frontend to Vercel:

## Prerequisites

1. Make sure you have a [Vercel account](https://vercel.com/signup)
2. Install the Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: `next build`
   - Output Directory: .next
   - Install Command: `npm install` or `pnpm install`
6. Add Environment Variables:
   - Name: `NEXT_PUBLIC_API_BASE`
   - Value: `https://karini-be.vercel.app`
7. Click "Deploy"

## Option 2: Deploy via Vercel CLI

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Run the Vercel CLI:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - What's your project name? karini-ai-frontend
   - In which directory is your code located? ./
   - Want to override settings? Yes
   - Build Command: next build
   - Output Directory: .next
   - Development Command: next dev
   - Want to add Environment Variables? Yes
   - Add NEXT_PUBLIC_API_BASE=https://karini-be.vercel.app

4. The deployment will start automatically

## After Deployment

1. Test your application by visiting the provided URL
2. Make sure the API calls are working correctly
3. Update the README.md with your frontend URL

## Troubleshooting

If you encounter any issues:

1. Check the build logs in the Vercel dashboard
2. Ensure your environment variables are set correctly
3. Make sure your backend is accessible from the frontend
4. Check CORS configuration if API calls are failing
