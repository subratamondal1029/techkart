FROM node:20

WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-*.yaml ./
RUN pnpm install

COPY . .

ARG BUILD=true
RUN if ["$BUILD" = "true"]; then pnpm run build; fi

EXPOSE 4173

CMD ["pnpm", "run", "preview"]