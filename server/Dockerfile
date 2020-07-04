# Create image based on the official Node 6 image from the dockerhub
FROM node:12

# Download image tools
RUN apt-get update \
  && apt-get install -yq poppler-utils ghostscript imagemagick

# Create a directory where our app will be placed
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /app/
EXPOSE 3001
CMD ["npm", "run", "dev"]