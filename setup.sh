# Why doesn't ubuntu come with curl anymore!
sudo apt-get update
sudo apt-get install -y curl

if command -v node; then
  echo "Node Installed Skipping install";
else
  echo "Node not installed, fetching";
  # Install Node js
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -;
  sudo apt-get install -y nodejs;
fi

# Start server
cd server
sudo npm install -g concurrently
sudo npm install -g nodemon
npm install
# Prepare all the server side stuff.
sudo node Prepare.js

# Start Client in dev mode
cd ../client/event-sys-gui
npm install
concurrently -k "npm start" "cd ../../server; sudo nodemon index.js"