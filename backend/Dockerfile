FROM node:22-bookworm-slim AS deps
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN apt-get update \
  && apt-get install -y --no-install-recommends nginx ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && mkdir -p /run/nginx

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/start.sh /start.sh

RUN sed -i 's/\r$//' /start.sh && chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]
