FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "start:prod"]
