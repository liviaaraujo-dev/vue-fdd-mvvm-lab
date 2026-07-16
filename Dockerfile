# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies (cached unless lockfile changes)
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS production

# SPA-friendly nginx config (fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets produced by Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
