# CS4098
Repo to store source code for CS4098 - Group Design Project

### Installation from a fresh ubuntu 16.04 LTS install
1. Open a terminal - 'ctrl/⌘ + alt + t'
2. Install git - ```sudo apt-get install -y git```
3. Enter your password when prompted.
4. Clone the repo - ```git clone https://github.com/jkk111/cs4098.git```
5. Navigate to newly created folder - ```cd cs4098```
6. Run setup script - ```./setup.sh```
7. Follow the instructions on screen and enter your details. Keep a note of your login credentials for later.
8. Once complete, the script should open the webapp in a browser. If this fails, navigate to ```localhost:3000``` in your favorite browser.

### Signing Up
1. Fill in your information in the sign-up and take note of your username and password for later.
2. To test if it works, try to log in to the account your just created.

### Logging In
1. Enter your username and password into the log in form.
2. A successful login will redirect you to the main landing page.
3. If login is failing, ensure your username and password are correct.

### Logging Out
1. To log out, simply press the logout button. You should be redirected to the login/signup page.

### Creating Venues
1. Before we can create events, we need to add venues for these events.
2. Go to the menu and click on 'Create Venue';
3. Fill in the correct information as indicated on-screen.
4. To check if your venue was added, navigate to the 'Create Event' screen and find your new venue in the '-select venue-' dropdown.

### Creating Tickets
1. Before we can create events, we need to add tickets for these events.
2. Go to the menu and click on 'Create Ticket';
3. Fill in the correct information as indicated on-screen.
4. To check if your ticket was added, navigate to the 'Create Event' screen and find your new ticket in the '-select tickets-' dropdown.

### Creating Events
1.  To begin adding events to the system, ensure you've already added venues and tickets.
2.  Once tickets and venues have been created, navigate to the 'Create Event' option in the menu.
3.  We must now fill in our information into all of the input fields.
4. Once the data is correct, click the 'Create Event' button at the bottom of the screen.
5. To check if your event was added to the system, navigate to the 'Events' screen in the menu. You should now see your newly created event listed.

### Viewing Events
1. The ability to see a list of all events is available to admins and all other users.
2. To view all events, click on 'menu' and select the 'Events' option.
3. You should now see a list of all events in the system.
5. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. If you are logged in as an admin you will also see 2 more administrative pieces of information about an event.

## Tests
Tests can be viewed by setting the url to /?tests=tests
