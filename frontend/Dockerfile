# ---------- Stage 1: Install only ----------
FROM node:20 AS base
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-*.yaml ./
RUN pnpm install
COPY . .

# ---------- Stage 2: Build (only for prod) ----------
FROM base AS builder
ENV VITE_BACKEND_BASE_URL=/api/v1
RUN pnpm run build

# ---------- Dev stage ----------
FROM base AS dev
EXPOSE 5173
CMD ["pnpm", "run", "dev"]

# ---------- Prod stage ----------
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]