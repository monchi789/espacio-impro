# syntax=docker/dockerfile:1.6

# ============================================================
# Stage 1 — builder: compila el sitio Astro estático
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependencias con cache eficiente
COPY package.json package-lock.json ./
RUN npm ci

# PUBLIC_API_URL se inyecta en el build (Astro lo expone al cliente)
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

COPY . .

RUN npm run build

# Pre-comprimir assets estáticos (gzip) para servir con gzip_static on
RUN find /app/dist -type f \( \
        -name '*.html' -o -name '*.css' -o -name '*.js' -o \
        -name '*.svg'  -o -name '*.json' -o -name '*.xml' -o \
        -name '*.txt'  -o -name '*.map' \
    \) -size +512c -exec gzip -9 -k -f {} \;


# ============================================================
# Stage 2 — runtime: nginx alpine sirviendo /dist
# ============================================================
FROM nginx:1.27-alpine

# Conf personalizada (cache de assets, brotli/gzip estáticos)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sitio estático + .gz + .br pregenerados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
