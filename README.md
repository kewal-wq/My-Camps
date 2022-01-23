# My-Camps
It is a full-fledged web application having almost all the features that a modern web-application consists of.
Here we have the campgrounds from all over the world.

# Some of the features include:- 
- One can create a new campground set its price and even show it location in the real world on the map.
- One can also update and delete the same.
- One can add the reviews and rate the campgrounds on the basis of stars.

# Authentication
-I have also set an authencation system which on nearly every request checks the originality of the user.
-In addition I have made a mongo store which stores the information of a user for a fixed duration of days and then automatically logs them out

# Security
-The website is very secure in terms of cross-site scripting, the users are restricted to inject/add any scripts in the form, if they do so the script will be detected and removed 
immediately.The user cannot send a malicious query in the url of the website.
-Also the networks adding the images to the campgrounds have been secured and only the trusted networks are allowed to that.


