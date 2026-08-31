# ---- Build ----
FROM oven/bun:latest AS build
WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install
COPY . .
RUN bun build src/index.ts --outdir dist --target bun

# ---- Runtime ----
FROM oven/bun:latest
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json bun.lockb* ./
RUN bun install --production || bun install
EXPOSE 3000
CMD ["bun", "run", "dist/index.js"]
