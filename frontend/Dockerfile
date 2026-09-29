# syntax=docker/dockerfile:1

# frontend / Dockerfile

FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@12.6.0 --activate

ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \ pnpm install --frozen-lockfile --store-dir /pnpm/store

COPY . .
RUN pnpm build

FROM nginx:1-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx","-g", "daemon off;" ]