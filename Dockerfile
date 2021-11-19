# build environment
FROM node:16-alpine as build
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
# install dependencies
RUN yarn
COPY . ./
ARG BASE_URL
ENV REACT_APP_BASE_URL $BASE_URL
RUN yarn build

# production environment
FROM nginx
EXPOSE 3000
COPY react_nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html