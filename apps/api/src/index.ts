import { app } from './app'
import { env } from './config/env'

// Hugging Face Spaces requires 0.0.0.0 + PORT=7860; local still uses 3000 via env.PORT
app.listen({ port: env.port, hostname: '0.0.0.0' }, () => {
  console.log(`🦊 Flowdoro API running on http://0.0.0.0:${env.port} (${env.nodeEnv})`)
})
