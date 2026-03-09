# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL

RUN npm run build

# ── Production stage ────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS final

COPY --from=build /app/dist /usr/share/nginx/html

# React Router support: fallback all routes to index.html
RUN printf 'server {\n  listen NGINX_PORT;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
    > /etc/nginx/conf.d/default.conf

EXPOSE 80
# At startup, replace NGINX_PORT placeholder with Railway's $PORT (fallback 80)
CMD ["/bin/sh", "-c", "sed -i \"s/NGINX_PORT/${PORT:-80}/\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
