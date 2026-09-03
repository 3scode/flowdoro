#!/bin/bash
set -e
echo "🚀 Deploying Flowdoro Web to Cloudflare Pages..."

# Build with API URL pointing to Workers
export VITE_API_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev
bun run --cwd apps/web build

# Deploy to Cloudflare Pages
bunx wrangler pages deploy apps/web/dist --project-name=flowdoro-web

echo "✅ Done! Your web app is at:"
echo "   https://flowdoro-web.pages.dev"
