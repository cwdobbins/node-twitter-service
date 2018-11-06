FROM alpine:3.7

WORKDIR /app

COPY . /app/

RUN apk add nodejs
RUN apk add --no-cache bash
RUN npm install

EXPOSE 8000

CMD ["node", "dist"]

