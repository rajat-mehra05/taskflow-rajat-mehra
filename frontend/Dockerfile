# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# Prefer strict/reproducible install; fall back when the lockfile can't be honored.
# The lockfile is generated on macOS, which omits Linux-only optional native deps
# (e.g. @emnapi/* pulled in by @napi-rs/* under Tailwind 4). `npm ci` rejects that
# on Linux, so we fall back to `npm install` to resolve the platform variants.
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
