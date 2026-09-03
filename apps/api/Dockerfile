# ---- Build ----
FROM oven/bun:latest AS build
WORKDIR /app

# Root workspace files
COPY package.json bun.lock ./
# API workspace
COPY apps/api/package.json apps/api/package.json

RUN cd apps/api && bun install --frozen-lockfile || bun install

# Source code
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json apps/api/tsconfig.json

RUN cd apps/api && bun build src/index.ts --outdir dist --target bun

# ---- Runtime ----
FROM oven/bun:latest
WORKDIR /app/apps/api

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/src/db ./src/db
COPY --from=build /app/apps/api/src/lib ./src/lib
COPY --from=build /app/apps/api/src/config ./src/config
COPY apps/api/package.json ./
RUN bun install --production || bun install

EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]
