FROM node:alpine as builder


RUN npm i -g @vercel/ncc pnpm 

WORKDIR /usr/app

COPY package.json .
COPY pnpm-lock.yaml .
COPY nx.json .
COPY tsconfig.base.json .
COPY .npmrc .
COPY  ./{appPath} ./{appPath}

RUN pnpm install --frozen-lockfile
RUN npx nx build api-gateway
RUN ncc build ./dist/{appPath}/main.js -m -o ./dist/{appPath}
RUN rm -rf ./dist/{appPath}/main.js


FROM alpine

# install the node with the smallest capacity possible
RUN apk add --no-cache libstdc++
COPY --from=node:lts-alpine /usr/local/include/node /usr/local/include/node
COPY --from=node:lts-alpine /usr/local/bin/node /usr/local/bin/node
COPY --from=builder /usr/app/dist/{appPath}/ /usr/app/

WORKDIR /usr/app
ENTRYPOINT [ "/usr/local/bin/node" ]
CMD ["index.js"]