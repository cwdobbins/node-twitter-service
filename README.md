# node-twitter-service
Node server to act as intermediary proxy for Twitter API v1.1 

# Setting up
- `npm install`
- `npm build`
- Edit config.ts.sample to populate Twitter app api key and secret key, and rename file to config.ts

# Running
node dist --port=(port)


# Running with Docker
- make sure you have docker installed on your system
- Edit config.ts.sample to add your twitter app keys
- docker build -t node-twitter-service .
- docker run -d -p (port-to-run-on):8000 node-twitter-service

