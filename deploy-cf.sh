#!/bin/bash
set -e
echo "🚀 Deploying Flowdoro API to Cloudflare Workers..."

# Check login (use bunx so it finds wrangler inside apps/api-cloudflare)
bunx wrangler whoami >/dev/null 2>&1 || { echo "❌ Not logged into Cloudflare. Run: bunx wrangler login"; exit 1; }

echo "📦 Deploying apps/api-cloudflare..."
bun run --cwd apps/api-cloudflare deploy

echo "✅ Done! Your API is live on Cloudflare Workers."
echo "   Check dashboard: https://dash.cloudflare.com/workers-and-pages"
