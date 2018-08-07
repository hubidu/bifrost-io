FROM node:8

# Create app directory
WORKDIR /usr/src/app

COPY ./docker/wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i npm@latest -g
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# TODO Make sure that selenium is up and running
CMD [ "npm", "start" ]