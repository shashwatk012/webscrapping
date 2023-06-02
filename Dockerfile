# Use the official Node.js 14.x LTS image as the base
FROM node:14

# Install dependencies required by Puppeteer and other dependencies you may have
RUN apt-get install nodejs npm \
    && apt-get update \
    && npm install -g puppeteer \
    && apt-get install chromium-browser \
    && apt-get install libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6

# Set up a working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm ci --only=production

# Copy the rest of the application files to the working directory
COPY . .

# Start the application
CMD ["node", "app.js"]
