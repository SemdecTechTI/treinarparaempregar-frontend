FROM ubi9/nodejs-22

ADD . .

RUN npm install

CMD npm run -d start