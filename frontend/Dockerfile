# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Production stage ────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS final

COPY --from=build /app/dist /usr/share/nginx/html

# React Router support: fallback all routes to index.html
# Use $PORT env var (injected by Railway) with fallback to 80
RUN printf 'server {\n  listen ${PORT:-80};\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n' \
    > /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
