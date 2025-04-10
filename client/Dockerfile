ARG ENV_FILE
# Build stage
FROM node:16-alpine as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY ${ENV_FILE} .env
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage  /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]