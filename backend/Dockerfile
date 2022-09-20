FROM python:3

WORKDIR /usr/src/app

RUN pip install mygene

RUN apt update
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt install -y nodejs && npm install -y npm

COPY . .

RUN npm install

CMD [ "node", "app.js" ]