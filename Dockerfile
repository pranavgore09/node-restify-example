FROM node:5.6.0
ADD . /
WORKDIR /server
RUN npm install