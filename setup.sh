# Why doesn't ubuntu come with curl anymore!
sudo apt-get install -y curl
# Install Node js
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# Start server
cd CS4098
cd server
npm install
sudo node index.js &

# Start Client in dev mode
cd ../client/event-sys-gui
npm install
npm start