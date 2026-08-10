FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    PUBLIC_DIR=/app/public

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json server.mjs ./
COPY *.html *.css *.js favicon* ./public/
COPY assets ./public/assets
COPY fitur ./public/fitur
COPY icons ./public/icons
COPY solusi ./public/solusi

USER node
EXPOSE 3000
CMD ["node", "server.mjs"]
