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
2. Currently, there is no minimum amount of characterrs required for any of the fields, and the email field does not require a real email address or the @ key.
3. To test if it works, try to log in to the account you just created, using what you entered into the username and password fields.

### Logging In
1. Enter your username and password into the log in form.
2. A successful login will redirect you to the main landing page. (Welcome Home)
3. If you are not directed to the Welcome Home screen when you click the log in button, your username or password is incorrect. Try again or create another account.

### Logging Out
1. To log out, simply press the logout button. You should be redirected to the login/signup page.

### Creating Venues
Admin access only
1. Before we can create events, we need to add venues for these events.
2. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Venue';
3. Enter the name of the venue. This can be the oficial name or a nickname, etc.
4. Enter a description of the venue. Size, how to enter, anything you want your guests to know.
5. Enter the address for the venue in address lines 1 and 2.
6. Enter the city the venue is in.
7. Enter how many people the venue can hold in the venue capacity field.
8. None of these fields are mandetory. However, if you do not enter a name, when you try to select a previously created venue, the dropdown option will appear empty. 
9. To save the venue, click on the create venue button at the bottom of the screen. The page should refresh and all fields cleared of what you entered.
10. To check if your venue was added, click on the menu button again, and then select 'Create Event' on the dropdown menu. In the "Create Event" page, there is a small dropdown menu labeled "select venue". Selecting this should display the venue name of the venue you just created, and allow you to select it.

### Creating Tickets
Admin access only
1. Before we can create events, we need to add tickets for these events.
2. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Ticket';
3. Enter the name of the ticket. This can be the name of the event, or the typee of ticket etc.
4. Enter a description of the ticket. What it entitles guests to, possible upgrades, how to buy, anything you want your guests to know.
5. Enter the price of the ticket. This can be in words or numbers.
8. None of these fields are mandetory. However, if you do not enter a name, when you try to select a previously created ticket, the dropdown option will appear empty. 
5. To save the ticket, click on the create ticket button at the bottom of the screen. The page should refresh and all fields cleared of what you entered.
6. To check if your ticket was added, click on the menu button again, and then select 'Create Event' on the dropdown menu. In the "Create Event" page, there is a small dropdown menu labeled "select tickets". Selecting this should display the ticket name of the ticket you just created, and allow you to select it.



### Creating Events
Admin access only
1.  To begin adding events to the system, ensure you've already added venues and tickets.
2.  Once tickets and venues have been created, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Event';
3. On the "create Event" page, enter the name of the event. 
This can be the name of the event, or the type etc.
4. Enter a description of the event. What charity its for, possible upgrades, anything you want your guests to know.
5. Enter the capacity of the event. This can be in words or numbers.
6. Select the venue and ticket for the event as shown in create ticket and create venue.
7. Select the date and time of the venue using the appropiate fields. This is done by clicking on the calender that appears when you click on the field.
8. None of these fields are mandetory. However, if you do not enter a name, when you try to select a previously created ticket, the dropdown option will appear empty. 
5. To save the ticket, click on the create ticket button at the bottom of the screen. The page should refresh and all fields cleared of what you entered.
6. To check if your ticket was added, click on the menu button again, and then select 'Create Event' on the dropdown menu. In the "Create Event" page, there is a small dropdown menu labeled "select tickets". Selecting this should display the ticket name of the ticket you just created, and allow you to select it.


4. Once the data is correct, click the 'Create Event' button at the bottom of the screen.
5. To check if your event was added to the system, navigate to the 'Events' screen in the menu. You should now see your newly created event listed.

### Viewing Events
1. The ability to see a list of all events is available to admins and all other users.
2. To view all events, click on 'menu' and select the 'Events' option.
3. You should now see a list of all events in the system.
5. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. If you are logged in as an admin you will also see 2 more administrative pieces of information about an event.

### Tests
1. Server Test
   1. To run server tests after cloning the repo, open your terminal and navigate to ```/cs4098/server/```.
   2. Run commands ```npm install``` followed by ```sudo npm test```.
   3. Enter your password and any other information if prompted to.
   4. The test results should be displayed on screen.
2. Client Tests
   1. Navigate to ```/cs4098/client/event-sys-gui/``` in your terminal.
   2. Run commands ```npm install``` followed by ```npm test```.
   3. The tests should run and their results should be displayed on-screen.
3. Tests In Browser
   1. Once tests have been run their results can be viewed in the browser if you prefer.
   2. Make sure the server is running by navigating to ```/cs4098/``` and running ```./setup.sh```.
   3. Enter enter information as prompted.
   4. Navigate to ```localhost:3000/?tests=tests``` in your browser to view.
