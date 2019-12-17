Practice Project
Here's a practice project that you can use to prepare for the actual take-home project and the interview.

Implement the Contact Manager app here:

http://devsaran.github.io/contact-manager-backbone/

You should implement all the features there, including the search. Also, implement a "tagging" feature, which allows you to create tags, such as "marketing," "sales," "engineering," and when you add/edit a contact, you can select a tag to attach to the contact. Finally, you can click on a tag and show all the contacts with that tag. The UI isn't too important here since the focus is on the functionality. The other difference between the project in the link and the one you'll develop is that your application will have an API server to store and retrieve contacts.

This practice project and the take-home project provide a good opportunity to start practicing your new-found knowledge of ES6. You can start with the basics like let, const, destructuring, default parameters, arrow functions, and the rest and spread operator. If you are using a newer version Chrome, Firefox or Safari, you will not have to use babel to transpile your code as these browsers support the above mentioned features. If you want to use babel, however, include babel-standalone in a script tag, and then use a script tag with type="text/babel" to include your application code:

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
<script type="text/babel" src="/javascripts/application.js"></script>

API Server
You can download the API server here. You must have a node version > 8.0 and npm installed to run this server on your computer. To set up the server, unzip the zip file, navigate to the application directory in the terminal, and run the following command:

npm install
This command will install all the dependencies required to the run the server. You can run the server with the following command:

npm start
This command will start the server on port 3000. The root URL of the application is http://localhost:3000. This URL will load the index.html file inside the public directory of the application. You can link to your JavaScript files and stylesheets in index.html. The public directory contains other directories to house your scripts, stylesheets, and images. To see all operations supported by the API, see the documentation at http://localhost:3000/doc. Here you'll see all API endpoints listed along with example requests and responses.

Review some of the course material and projects if you get stuck, and feel free to play with object creation patterns that we covered in the previous course. The real take-home project is more advanced than this project, and you're expected to complete it within 72 hours. So make sure you feel comfortable with this project before you proceed.

features:
- add contact
  full name
  email address
  telephone number
  submit + cancel - buttons
POST
http://localhost:3000/api/contacts/
- all fields are required
- does not validate input of name or phone number until submit is hit
- email has to be in email format

- edit contact
  shows full contact fields again but with "edit contact" header
  - PUT
  http://localhost:3000/api/contacts/:id
- cancel returns to full display of all contacts

- delete contact
triggers confirmation: "Do you want to delete the contact? Cancel / OK"
 - DELETE from server & reload display
http://localhost:3000/api/contacts/:id

- search
  searches dynamically with each keystroke
    "there is no contact starting with " + input of search bar
  - searches name only 
    filters display to only first match
    checks if search bar value is anywhere in the name


each contact is displayed as:  Use handlebars!

header name

bold "Phone Number:"
number
bold "Email:"
email address

edit and delete buttons
delete button triggers confirmation: "Do you want to delete the contact? Cancel / OK"

contacts are listed in the order they're added to the program.
- GET
http://localhost:3000/api/contacts - all 

http://localhost:3000/api/contacts/:id - single

tagging feature: 
create tags
add them to an array of options in the program 

create a dropdown select menu to add one or more tags to a given contact
tags saved as comma-separated string, with no spaces
filter by whether the string contains the word between commas.

show the tags on the screen somewhere in the main view
  click on each to filter and display only contacts with that tag


create template for add contact / edit contact
create template for contacts 

create form to add a category
  - on submit 
    category name is verified against the list
    if it exists
      - message "category `category-name` already exists"
    else 
      - message "category `category-name` successfully added to the list
  form remains
  include button to return to main contacts screen


contacts
if contacts object is empty
  display #no-contacts section
else 
  display #contacts section  

  TODO: 
X add 'categories' / tagging functionality 
  - categories should be a single word
    no spaces or punctuation
  - display message: "category was successfully added" when successful
  - parse tags from existing contacts in database  
  - change to checkboxes from select list

existing categories: 
  split list
  iterate over list
  checking the ones that were existing

  categories list in 'add contact'
  iterate over categories array from App object and generate checkboxes

  - serialize data to pass into ajax request
  - make sure existing tags are checked when editing

X Header Contacts List link should display main
X add search functionality
X add form validation / alert functionality
  prevent submission of invalid forms

  add red border for invalid input fields
  highlight their label

  prevent letters from being entered into phone field
  prevent numbers from being entered into name field


Questions:
1) error in console but does not affect application: "Error in event handler: TypeError: Cannot read property 'getCurrent' of undefined at e (chrome-extension://lhdoppojpmngadmnindnejefpokejbdd/adapter.bundle.js:31:1210)" 
Anything to be concerned about?