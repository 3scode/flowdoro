#!/bin/bash
set -e
echo "🚀 Deploying Flowdoro Web to Cloudflare Pages..."

# Build with API URL pointing to Workers
export VITE_API_URL=https://api.flowdoro.3scode.my.id
bun run --cwd apps/web build

# Deploy to Cloudflare Pages
bunx wrangler pages deploy apps/web/dist --project-name=flowdoro-web

echo "✅ Done! Your web app is at:"
echo "   https://flowdoro.3scode.my.id"
echo "   API: https://api.flowdoro.3scode.my.id"
