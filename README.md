# CS4098
Repo to store source code for CS4098 - Group Design Project

## Installation
### From a fresh ubuntu 16.04 LTS install
1. Open a terminal - 'ctrl/⌘ + alt + t'
2. Install git - ```sudo apt-get install -y git```
3. Enter your password when prompted.
4. Clone the repo - ```git clone https://github.com/jkk111/cs4098.git```
5. Navigate to newly created folder - ```cd cs4098```
6. Run setup script - ```./setup.sh```
7. Follow the instructions on screen and enter your details. Keep a note of your login credentials for later.
8. Tips
 	* Eventbrite token - this must be a lower case "no" if not using eventbrite
	* Email / SMTP Host / SMTP Port - leave blank to not set up email
	* Mail Password - You can't leave this blank. Enter something simple like 'password' if you don't want to use email.
9. Once complete, the script should open the webapp in a browser. If this fails, navigate to ```localhost:3000``` in your favorite browser.

## Release 1

###Feature 1 - I want to be able to login (change password/details/create account).

1. To login, first you need to have signed up as described in "Installation". Alternatively you can create an account for a new user (not admin) in the "Sign-Up/Create an Account" section (see step 2).
2. Once the webapp has opened in a browser, you should be presented with the Login/Signup page.
3. If you wish to login without using the credidentals you made in installation, you can sign up.
	a. To do this, go to the "Sign Up/Create An Account" 			   section.
	b. Enter your first name in the "First Name" field.
	c. Enter your Surname in the "Last Name" field.
	d. Enter whatever username you want to use in the app into 	  	   the "Username" field.
	e. Enter your email in the "email" field.
	f. Create a password for your account and enter it into the 	   "Password" field.
	g. Confirm the password you just entered.
	h. If your username and password are acceptable, you will be  	   automatically logged into the system, being directed to 	  	   the home page, with "Welcome Home" being displayed. You 	 	   can then use this same username and password to login in  	   future. If your username is already in use, or your 	 	   password and confirm password are not the same, then you 	   will not be able to sign up and an error message will be 	   displayed. Make sure your username is unique and your 		   passwords the same to proceed.
	(Note: There is no minimum amount of characters required for 	 any of these fields, and the email field does not require a 	 real email address or the @ key. However if you do not 	 	 enter a valid email, and verify your email, you will not be 	 able to recieve any email updates.)
4. Enter your username and password into the login form. You may use the username and password you created during the installation steps(This will be an admin account), or one created during the signing up step(This will not be an admin account).
5. A successful login will redirect you to the main landing page. (Welcome Home)
6. If your credidentials do not match, have not been previously created, or incorrect in general, then you will be unable to login and "Invalid Username/Password" will be displayed. Ensure your username and password are correct to proceed.
7. You can change your details and password on the "Settings" page. To view settings, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Settings'.
8. You should be able to see your first name and last name, as well  as your email. These are the values you entered when you originally signed up. If you want to change any of these, click on the field you want to change and enter the new value. Then click save.
9. There are also extra fields that you can fill in to complete your profile. You can enter your phone number in the "Phone" field so the organisers can contact you if necessary. You can also enter any allergens you may have. To do this, click on "Add Allergen", and then use the dropdown to select which allergens apply to you. If you have any additional dietary requirments (vegan, vegetarian, etc.), or any accessibility requirements, you can enter them in the text box. You can also select or deselect the check box to be subscribed to the mailing list. Click save to keep these inputs.
10. If you wish to change your password, click on the change password button. Enter your current password, and then enter the new password you want, and confirm it. This password can be any combination of letters and numbers. It has no minimum length. Then click the "Save changes" button. You can now log in using your new password instead of the old one. If you click into this page automatically just click on cancel to exit. Do not save changes unless you actaully want to change your password.
 	
	
###Feature 2 - I want to be able to give admin access to other people.
Admin Access Only
1. To give admin access to other people go to the "View Users" page. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Users'
2. The list of users, both admin and not, will appear. You can click on a users name to see more details about them.
3. An Admin may grant a user admin status on this screen by clicking the grant admin button visible in the users details.

 
###Feature 4 - I would like to be able to create an event e.g. a dinner.
Admin access only
1.  To begin adding events to the system, ensure you've already added tickets. (See "Creating Tickets")
2.  Once tickets and have been created, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Event'.
3. On the "Create Event" page, enter the name of the event.
This can be the name of the event, or the type etc.
4. Enter a description of the event. What charity its for, possible upgrades, anything you want your guests to know.
5. Enter the location for the event. An address, landmark, etc.
6. Select the date and time of the venue using the appropiate fields. This is done by clicking on the calender that appears when you click on the field. The time can be selected at the bottom of the calender. If your start time occurs after the end time, you will see an warning message if you attempt to create an event.
7. Select the menu you want associated with the event, by selecting from all the menus you have created (see feature 46) that can be seen in the dropdown menu. Having a menu for an event is not mandetory.
8. Select the auction you want associated with the event, by selecting from all the auctions you have created (see feature 121) that can be seen in the dropdown menu. Having an auction for an event is not mandetory.
9. Click the "Add a ticket" button to add tickets to this event. Once you click this button you may select a ticket from the dropdown menu if you have already created it in the "Create Ticket" page. You can then select the amount of tickets you want, either by typing in the number or by using the arrows to add more or less tickets. If you do not have any tickets for your event and try to click "Create Event" you will be preseted with a warning message.
10. To save the event, click on the create event button at the bottom of the screen. If you have not named your event you will be presented with a warning message and be unable to create your event. Name your event to continue.
11. Any event created will automatically sent out email invites to all users.
12. Saved events appear in the "View Events" section in the main menu.

### Creating Tickets
Admin access only
1. Before we can create events, we need to add tickets for these events.
2. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Ticket';
3. Enter the name of the ticket. This can be the name of the event, or the typee of ticket etc.
4. Enter a description of the ticket. What it entitles guests to, possible upgrades, how to buy, anything you want your guests to know.
5. Enter the price of the ticket. This must be in numbers. You will be presented with an error message if you try to create a ticket with the price in words.
8. All these fields are mandetory. If you try to save a message without entering all the details you will be presented with a warning message.
5. To save the ticket, click on the create ticket button at the bottom of the screen. The page should refresh and all fields cleared of what you entered.
6. To check if your ticket was added, click on the menu button again, and then select 'Create Event' on the dropdown menu. In the "Create Event" page, there is a button called "Add Ticket" Selecting this should a dropdown with the ticket name of the ticket you just created, and allow you to select it. 


###Feature 6 - Keep track of possible/previous guests.
Admin Access Only
1. To keep track of all the users on the app, go to the "View Users" page. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Users'
2. The list of users, both admin and not, will appear. You can click on a users name to see more details about them.
  
###Feature 7 & 8 - I want to sent invitations to a mailing list, so that people know to come and that they are invited.
Admin Access Only
1. When you create any new event (see feature 4) all subscribed users are automatically emailed about the event, giving them information and telling them how to get a ticket.
 
###Feature 9 - I want to see guests contact details.
Admin Access Only
1. To see guests contact details, go to the "View Users" page. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Users'.
2. The list of users, both admin and not, will appear. You can click on a users name to see more details about them.
3. When you click on a name, you will be able to see the users email address, as well as their phone number if they have provided one.

###Feature 10 - I want to see the invite list.
1. All users who have verified their emails with the app are automatically invited to all events created.
2. To see the users, go to the "View Users" page. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Users'.
3. The list of users, both admin and not, will appear. You can click on a users name to see more details about them.

 

###Feature 13 - As staff, I need to register a guest for one event (including their details), so I can track what is needed for the event.
Admin Access Only
1. To register a guest, an Admin can make them an account in "Create User". They should know the guests first name, last name,and email.
2. To create a user, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create User'
3. Fill in the customers first name, last name and email address. Initials are accepted as there is no minimal character length. If you enter the correct email for the guest, they will be sent a link that will allow them to create their account and fill in their details.

    
###Feature 16 - I want to be able to send automated invitations, with link to register for the event.
Admin Access Only
1. When you create any new event (see feature 4) all subscribed users are automatically emailed about the event, with links to the app for them to buy tickets.
  
###Feature 18 - Set up a ticketing service, so people can buy tickets without human interaction.
1. The ability to buy a ticket online can be used on the "View Events" page.
2. To view all events, click on 'menu' and select the 'View Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. To buy a ticket, click on the "Buy for ..." button. A pop-up from stripe will then appear, prompting you to enter your payment details. This action can be cancelled by clicking the X button at the top right corner of the pop-up. If you successfully buy a ticket, you will be emailed your ticket and reciept.

  
###Feature 32 - e-ticketing for users.
1. The e-ticketing system can be seen on the "View Events" page.
2. To view all events, click on 'menu' and select the 'View Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. To buy a ticket, click on the "Buy for ..." button. A pop-up from stripe will then appear, prompting you to enter your payment details. This action can be cancelled by clicking the X button at the top right corner of the pop-up. If you successfully buy a ticket, you will be emailed your ticket and reciept.


###Feature 34 - Send out emails automatically when an event is created.
Admin Access Only
1. When you create any new event (see feature 4) all subscribed users are automatically emailed about the event, giving them information and telling them how to get a ticket. 
 
###Feature 36 - Online ticketing - keeping in mind that mostly repeat customers/attendees.
1. The ability to buy a ticket online can be used on the "View Events" page.
2. To view all events, click on 'menu' and select the 'View Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. To buy a ticket, click on the "Buy for ..." button. A pop-up from stripe will then appear, prompting you to enter your payment details. This action can be cancelled by clicking the X button at the top right corner of the pop-up. If you successfully buy a ticket, you will be emailed your ticket and reciept.
8. Users can select "Remember me" to securely store their payment information, so regular customers can quickly checkout. For verification purposes the customer must provide their mobile number.


###Feature 40 - I would like to email (legitimately) subscribed users.
Admin Access Only
1. When you create any new event (see feature 4) all subscribed users are automatically emailed about the event, giving them information and telling them how to get a ticket. 
   
###Feature 42 - I want to be able to contact attendees easily e.g. group emails.
Admin Access Only
1. When you create any new event (see feature 4) all subscribed users are automatically emailed about the event, giving them information and telling them how to get a ticket. 


###Feature 46 - I want to create menus.
Admin Access Only
1. This is where the admin can create a menu for a certain event.
2. To create a menu, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create menu'
3. First name the menu by using the "Menu Name" field. Any name is accepted.
4. Then input the starter information. Enter the name of the starter, a description of the starter, and any allergen information that corrolates to the allergens involved in the dish, all in the relevant fields. If you wish to add another starter option as well as the one you already have, click the "Add Starter" button. Then input the same information as detailed in this step.
5. Repeat step 4 for the main course, desserts, and drinks.
6. Not all fields are mandetory. However if you do not enter a name for your menu it will appear as an empty string in the "view menu" screen, as well as in the dropdown in create events.
8. When you have finished adding things to your menu, click "Create Menu".
9. To check if your menu was added, click on the menu button again, and then select 'view menus' on the dropdown menu. The name of the menu should appear there.


###Feature 61 - I want to be able to purchase tickets through a simple online site, so I can attend the event.
1. The ability to buy a ticket online can be used on the "View Events" page.
2. To view all events, click on 'menu' and select the 'View Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. To buy a ticket, click on the "Buy for ..." button. A pop-up from stripe will then appear, prompting you to enter your payment details. This action can be cancelled by clicking the X button at the top right corner of the pop-up. If you successfully buy a ticket, you will be emailed your ticket and reciept.
 
###Feature 62 - View tickets.
1. An admin can see tickets they have created on the "Create Event" page. This is done by clicking the "Add Ticket" button, and then selected the required ticket from the dropdown.
2. A guest can view a ticket in "View Events". This is done by clicking on the event you want to attend. The ticket name will appear, along with the option to buy it.
 
###Feature 63 - Create an account/register.
1. If you are already logged in, log out (See logging out).
1. To create an account, go to the "Sign Up/Create An Account" screen. If you have not been previously logged in your will be automatically be sent to this page on startup.
2. Enter your first name in the "First Name" field.
3. Enter your Surname in the "Last Name" field.
4. Enter whatever username you want to use in the app into 	  	   the "Username" field.
5. Enter your email in the "email" field.
6. Create a password for your account and enter it into the 	   "Password" field.
7. Confirm the password you just entered.
8. If your username and password are acceptable, you will be  	   automatically logged into the system, being directed to 	  	   the home page, with "Welcome Home" being displayed. You 	 	   can then use this same username and password to login in  	   future. If your username is already in use, or your 	 	   password and confirm password are not the same, then you 	   will not be able to sign up and an error message will be 	   displayed. Make sure your username is unique and your 		   passwords the same to proceed.
(Note: There is no minimum amount of characters required for 	 any of these fields, and the email field does not require a 	 real email address or the @ key. However if you do not 	 	 enter a valid email, and verify your email, you will not be 	 able to recieve any email updates.)

###Feature 64 - Check date, time, seat at event, so I can arrive on time and find my seat easily.
1. The ability to check all deatils about an event is availaible on the "View Events" page. 
2. To view all events, click on 'menu' and select the 'Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
5. To see more information about an event, click on the event name.


###Feature 71 - I want to view event information so I can decide if I want to attend.  
1. The ability to check all information about an event is availaible on the "View Events" page. 
2. To view all events, click on 'menu' and select the 'Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
5. To see more information about an event, click on the event name. If you decide you want to atttend, you can buy a ticket on that page by clciking the "Buy for..." button.

###Feature 72 - I want to be able to easily see details fo the event - time, venue, etc.
1. The ability to check all information about an event is availaible on the "View Events" page. 
2. To view all events, click on 'menu' and select the 'Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
5. To see more information about an event, click on the event name. 

###Feature 73 - Look at dinner menu.
Admin Access Only
1. This is where admins can see the menu options they created.
2. To view menus, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Menus'.
3. The list of menu names will appear.
4. Click on a Menu name for further information on the menu.
5. Guests can see the menu for an event on the "View Events" page. On the "View Events" page, click on the event you are interested. The dropdown will show a "View Menu" option. Click on it to see the menu for the event.

  
###Feature 74- I would like to buy a ticket to attend the event.
1. The ability to buy a ticket can be used on the "View Events" page.
2. To view all events, click on 'menu' and select the 'View Events' option.
3. You should now see a list of all events in the system.
4. If you see a message saying there are no events, then there are no events in the system.
6. To see more information about an event, click on the event name.
7. To buy a ticket, click on the "Buy for ..." button. A pop-up from stripe will then appear, prompting you to enter your payment details. This action can be cancelled by clicking the X button at the top right corner of the pop-up. If you successfully buy a ticket, you will be emailed your ticket and reciept.

  
###Feature 87 - I want to be notified when new events are released. 
1. When you create any new event (see feature 4) all subscribed users are automatically emailed about the event, giving them information and telling them how to get a ticket. 
  

### Logging Out
1. To log out, simply press the logout button in the menu. You should be redirected to the login/signup page.




## Release 2

### Feature 4 - I would like to be able to create an event, e.g. a dinner
Admin access only
1.  To begin adding events to the system, ensure you've already added tickets. (See "Creating Tickets")
2.  Once tickets and have been created, click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Event'.
3. On the "Create Event" page, enter the name of the event.
This can be the name of the event, or the type etc.
4. Enter a description of the event. What charity its for, possible upgrades, anything you want your guests to know.
5. Enter the location for the event. An address, landmark, etc.
6. Select the date and time of the venue using the appropiate fields. This is done by clicking on the calender that appears when you click on the field. The time can be selected at the bottom of the calender. If your start time occurs after the end time, you will see an warning message if you attempt to create an event.
7. Select the menu you want associated with the event, by selecting from all the menus you have created (see feature 46) that can be seen in the dropdown menu. Having a menu for an event is not mandetory.
8. Select the auction you want associated with the event, by selecting from all the auctions you have created (see feature 121) that can be seen in the dropdown menu. Having an auction for an event is not mandetory.
9. Click the "Add a ticket" button to add tickets to this event. Once you click this button you may select a ticket from the dropdown menu if you have already created it in the "Create Ticket" page. You can then select the amount of tickets you want, either by typing in the number or by using the arrows to add more or less tickets. If you do not have any tickets for your event and try to click "Create Event" you will be preseted with a warning message.
10. To save the event, click on the create event button at the bottom of the screen. If you have not named your event you will be presented with a warning message and be unable to create your event. Name your event to continue.
11. Any event created will automatically sent out email invites to all users.
12. Saved events appear in the "View Events" section in the main menu.


### Feature 5 - I want to be able to update event information and submit event updates
Admin Access only
1. The ability to edit events can be used from the "View Events" page.
2. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Events'.
3. In the view events page, you can see all the events you have created. Click on the event name you wish to edit and all the details of that event will appear.
4. Click on "Edit this Event"
5. You will be directed to the screen that allows you to change the event details.
6. You can change the event description, location, start time and end time by filling in your required changes into the respective fields. You are not able to change the name of the event. You also cannot remove tickets that have already been added to an event, but you can add additional ticket types.
7. When you have finished, click the "Update Event" button. The event will be updated. This can be checked by returning to the view events page and viewing the changed event.
8. When the event is updated, all attendees are automatically emailed with the updates.


### Feature 30 - I want to see dietary requirements and access requirements of attendees so I can provide details to catering
Admin Access Only
1. Users are able to enter dietary requirements and access requirements in the settings page.
2. They do this by clicking on the menu button on the top of the screen. This will drop down all the menu options. They then click on 'Settings'.
3. To add an allergen, the user clicks the "Add Allergen" button. A dropdown menu will then appear, where the user can select what allergens apply to them. They can also delete allergens by clicking the red X at the side of the dropdown.
4. They can also type in any additional dietary information or accessibilty requirements by typing it in the textbox.
5. Admins can then see this information on the "View Users" page. If they click on a users name, that users details will appear, including dietary and accessability requirements.
6. If an Admin wants to 

### Feature 31 - I want to be able to share special dietary requirements (including table info for guests) with the caterer
Admin Access Only
TODO

### Feature 32 - I want to see the table layout and seating arrangements so the tables can be organised
Admin Access Only
TODO

### Feature 49 - I want to be able to accept and see payments
Admin Access Only
TODO

### Feature 53 - Have a live tracker that updates with donations throughout the event
1. Both users and admins can see a live tracker associated with each event.
2. The live tracker can be accessed in the "View Events" page.
3. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Events'.
4. In the view events page, you can see all the events you have created. Click on the event name you wish to view and all the details of that event will appear.
5. Click the "View Live Tracker" button. This will bring you to the donation tracker page.
6. When someone makes a donation, the tracker will show the amount raised overall.
7. To exit the live tracker, click on the menu button at the top of the page.


### Feature 54 - I want to track current amount raised
1. Both users and admins can see a live tracker associated with each event.
2. The live tracker can be accessed in the "View Events" page.
3. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'View Events'.
4. In the view events page, you can see all the events you have created. Click on the event name you wish to view and all the details of that event will appear.
5. Click the "View Live Tracker" button. This will bring you to the donation tracker page.
6. When someone makes a donation, the tracker will show the amount raised overall.
7. To exit the live tracker, click on the menu button at the top of the page.
8. At the end of the event, the live tracker will show the total amount raised on the night.

### Feature 121 - I want to set up an auction
Admin Access Only
1. To create an auction, you must go to the "Create Auction" page.
2. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Auction'.
3. On the "Create Auction" page, enter the name of the auction.
This can be the name of the auction, or the type etc.
4. Enter a description of the auction. Who donated items, special pieces, anything you want your guests to know.
5. Select the date and time of the auction using the appropiate fields. This is done by clicking on the calender that appears when you click on the field. The time can be selected at the bottom of the calender.
6. All fields are mandetory, except for the description. There is no minimum amount of characters needed for the name. Trying to create an event without a name or start/end will display an error message. Additionally your start date/time must be before the end date/time, otherwise you will get a warning message.
7. To save the auction, click on the "Create Auction" button at the bottom of the screen.
8. Items can be added to a particular auction in the "Create Items" page. You must have previously created an auction first.
9. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Items'.
10. On the "Create Item" page, enter the name of the item.
11. Enter a description of the auction. Who donated it, history, anything you want your guests to know.
12. Enter the starting price of the item. This must be a number.
13. Select the auction that the item is for by choosing it from the dropdown menu.
14. To save this item, click the "Create Item" button. All fields are mandetory.
15. To view a created auction and its associated items, go to the "View Auction" page (see feature 132)

### Feature 122 - I want a way to record payments on the night

### Feature 132 - I want to be able to see auction information, including information on auction items
1. Users and Admins can see information on auctions in the "View Auctions" page.
2. Click on the menu button on the top of the screen. This will drop down all the menu options. Click on 'Create Auction'.
3. On the view auctions page, all previously created auction names are displayed. Click on an auction page and a drop down will show all the information on that auction.
4. In the dropdown, all the items saved to this auction will also be displayed. To view information on a particular item, click on its name and all its information will drop down. This can be done for all items in an auction.
5. In the dropdown for each item, you can also place a bid. To do this, enter the amount you wish to bid in the text box and then click the "Bid!" button. This must be inputted as a number.
6. The current bid will then be updated to how much you entered.


## Tests
1. Server Test
   1. To run server tests after cloning the repo, open your terminal and navigate to ```/cs4098/server/```.
   2. Run commands ```npm install``` followed by ```sudo npm test```.
   3. Enter your password and any other information if prompted to.
   4. The test results should be displayed on screen.
2. Client Tests
   1. Navigate to ```/cs4098/client/event-sys-gui/``` in your terminal.
   2. Run commands ```npm install``` followed by ```npm test```.
   3. The tests should run and their results should be displayed on-screen.
