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
7. After you select the ticket you want from the dropdown menu a "amount of tickets" field will appear. Enter the amount of tickets on sale. 
8. Select the date and time of the venue using the appropiate fields. This is done by clicking on the calender that appears when you click on the field. (Note: there is a current issue with the screen not sliding down enough to access the end date field properly)
9. To save the event, click on the create event button at the bottom of the screen.
10. Saved events should appear in the "event" section in the main menu, however events are not currently changing at the moment.


### Viewing Events
1. The ability to see a list of all events is available to admins and all other users.
2. To view all events, click on 'menu' and select the 'Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.

### Settings
1. To view settings, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Settings';
2. You should be able to see your first name and last name, as well  as your email. These are the values you entered when you originally signed up.
3. If you want to change any of these, click on the field you want to change and enter the new value. Then click save.
4. If you wish to change your password, click on the change password button. Enter your current password, and then enter the new password you want, and confirm it. This password can be any combination of letters and numbers. It has no minimum length. Then click the "Save changes" button. You can now log in using your new password instead of the old one. If you click into this page automatically just click on menu to exit. Do not save changes unless you actaully want to change your password.

### Create User
Admin Access Only
1. Create user is for admins to create accounts for their customers. They should know the customers first name, last name,and email. 
2. To create a user, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create User'
3. Fill in the customers first name, last name and email address. Initials are accepted as there is no minimal character length. Additionally the email field is not currently required to have a real email. (Note: there shhould be a username and password field in this menu. The admin sets up a username and password for the customer and sends the details to them. Then the customer can log in using these credidentals, and then change their password in the settings menu.)

### Create Menu
Admin Access Only
1. This is where the admin can create a menu for a certain event.
2. To create a menu, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create menu'
3. First name the menu by using the "Menu Name" field. Any name is accepted.
4. Then input the starter information. Enter the name of the starter, a description of the starter, and any allergen numbers that corrolate to the allergens involved in the dish, all in the relevaant fields. The official food allergen information sheet can be viewed while the admin is creating a starter. For example, if the starter contains peanuts, the admin will enter number 5 in the allergen box for that starter, which corresponds to the reference sheet as "5. Peanuts and products thereof". If you wish to add another starter option as well as the one you already have, click the "add starter" button. Then input the same information as detailed in this step.
5. Repeat step 4 for the main course, desserts, and drinks.
6. Currently not all fields are mandetory. However if you do not enter a name for your menu it will not appear in the "view menu" screen.
7. When you have finished adding things to your menu, click "Create Menu".
8. To check if your menu was added, click on the menu button again, and then select 'view menus' on the dropdown menu. The name of the menu should appear there.

### View Users
Admin Access Only
1. This is where the admin can see the list of all the users.
2. To view users, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Users'
3. The list of users, both admin and not, will appear. You can click on a users name to see more details about them. (Note: there is currently no option to input phone number.)
Subscribed applies to users who have signed in themsleves after being sent a username and password. Verified applies to email verification.

### View Menu
1. This is where everyone can see the menu options.
2. . To view menus, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Menus'
3. The list of menu names will appear. (Note: currently you can only see the names of menus)












