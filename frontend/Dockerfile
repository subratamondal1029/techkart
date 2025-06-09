FROM node:20

WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-*.yaml ./
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 4173

CMD ["pnpm", "run", "preview"]