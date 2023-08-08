FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=godbaby --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile

# Build the project
COPY --from=pruner /app/out/full/ .

RUN --mount=type=cache,id=turbo,target=node_modules/.cache \
  pnpm turbo run build --filter=godbaby

FROM node:18-alpine AS runner
WORKDIR /app/apps/godbaby

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/godbaby/next.config.js .
COPY --from=installer /app/apps/godbaby/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/godbaby/.next/standalone .
COPY --from=installer --chown=nextjs:nodejs /app/apps/godbaby/.next/static .next/static
COPY --from=installer --chown=nextjs:nodejs /app/node_modules /app/node_modules
# COPY --from=installer --chown=nextjs:nodejs /app/apps/godbaby/public apps/godbaby/public

CMD node server.js
