FROM node:12-alpine as builder

# create user and group for microgateway
RUN npm install -g @angular/cli@8.3.26

RUN mkdir /apps

WORKDIR /apps

# RUN git clone -b kong https://github.com/DavidLepoultier/mgstatus-angular.git .
COPY package*.json ./
RUN npm install

# Build package
COPY . .
RUN ng build --prod

FROM nginx:alpine

WORKDIR /apps

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /apps/dist/* /apps/

EXPOSE 80