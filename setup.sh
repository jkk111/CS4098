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
cd CS4098
cd server
npm install
sudo node index.js &

# Start Client in dev mode
cd ../client/event-sys-gui
npm install
npm start