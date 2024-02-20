FROM node:18.18.2-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build

FROM node:18.18.2-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY prisma ./prisma
COPY package*.json ./
RUN npm install --omit=dev
RUN npm install pm2 prisma -g
RUN ls -a
RUN sed -i '5,9d' ./prisma/schema.prisma
RUN prisma generate

COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/build /app/build

EXPOSE 3333
CMD ["pm2-runtime", "build/server.js"]