# lunotel-next/Dockerfile
FROM node:20.16.0-alpine
WORKDIR /usr/src/lunotel-next
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 600000
COPY . .
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG LUNOTEL_API_GRAPHQL_URL
ARG REACT_APP_API_GRAPHQL_URL
ARG KAKAO_JAVASCRIPT_KEY_MAP
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
