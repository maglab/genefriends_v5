FROM node:14.19.3

COPY . .

RUN npm install
RUN npm run build
RUN npm install --global http-server
CMD http-server dist/ -a 0.0.0.0 -p 3000 -P http://0.0.0.0:3000/?