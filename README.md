# International Payments Portal, Customer Portal
# Version 1

# Contents:
Purpose
Authors
GitHub Repo and YouTube Demo Video Links
Project Requirements
Installation Instructions
Functional Requirements
Non-Functional Requirements
References

# Purpose:
This project is for creating a secure customer payment portal in an international payments portal

# Authors:
Mthokozisi Mwandla, ST10084814@vcconnect.edu.za
Wandile Soji, ST10025655@vcconnect.edu.za
Mpumelelo Mjwara, ST10084574@vcconnect.edu.za
Tawanda Mafuta, ST10080913+@vcconnect.edu.za

# GitHub Repo and YouTube Links:
https://github.com/mmwandla/international-payments-portal
https://youtu.be/onewNlm5Ry4

# Project Requirements:
MySQL installed
Node installed
VS Code installed (or preferred code editor for JavaScript and NodeJS development)

# Installation Instructions:
--> the certs folder would not be pushed to git and would be in the .gitignore in a production environment, it is included for ease of running the app due to difficulty with having https configured for development, separated certs will be used for "production"

--> prerequisites: IDE for JavaScript development (ideally VS Code), MySQL database created (see instructions for further guidance), node installed (go to https://nodejs.org/en and install for your machine), JWT_SECRET generated(use this command in your terminal after installing node--> (node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"), copy and paste everything within the brackets to your terminal, the result is your JWT_SECRET which you'll have in your .env file, see instructions for further guidance on JWT_SECRET and .env file

--> create database
after installing MySQL and establishing connectiong server, create database, use database, and view tables in database with these scripts:

CREATE DATABASE international_payments_portal;
USE international_payments_portal;
SELECT * FROM users;
SELECT * FROM payments;

--> instructions to run

1) download project zip file
   
2) open project using chosen IDE for JavaScript development (ideally VS Code, where this project was completed)
   
3) create .env file in backend directory, add the following in the file:
MYSQL_HOST=localhost
MYSQL_USER=root (change this to your username if it isn't root, delete this message and the brackets afterwards)
MYSQL_PASSWORD= (add your password for MySQL connection)
MYSQL_DATABASE=international_payments_portal (you will have to create this database in MySQL, use the exact name here)
JWT_SECRET= (generate a jwt secret and place it here)
PORT=443
NODE_ENV=development
ALLOWED_ORIGINS=https://localhost:3000
HTTPS=true

4) create a .env file in customer-portal directory, add the following in the file:
HTTPS=true

5) open a terminal and use the following commands to run the backend server and the frontend, 1) navigate to backend using this command, copy the contents within the brackets and not the brackets themself (cd customer-portal\backend), and then use the command within the brackets to start the backend server (npm start). 2) open another terminal and use the following command to navigate to the frontend (cd customer-portal), and then use the command (npm install) followed by the command (npm start). your frontend will open in your default or open browser.

--> step 5 assumes that node is now properly installed on your machine, the commands wont work if it isn't. it also assumes your project is properly configured as per the instructions and you are at the root of the project.

6) the browser will say the certificate is invalid due it being self-signed and you will see this error "Your connection is not private, net::ERR_CERT_AUTHORITY_INVALID", ignore this and click "advanced" and then "proceed"

-> don't enter any sensitive information, only mock data for the sake of testing functionality

7) The app will now run and you can use it.

# Functional Requirements:
* Customer login using account number and password.
* Customer registration using full name, id number, account number, and password.
* Customer payment creation using amount, currency code, provider, recipient account number, and swift code.
* Customer past payments listed.

# Non-Functional Requirements:
*Security: password security with hashing and salting, whitelist input using regex patterns, serve traffic SSL, 
           protect against session jacking, click jacking, SQL injection, cross site scripting, main in the middle, 
           and DDoS attacks.

# References:
NPM
https://www.npmjs.com/
-> for packages related to security and development such as helmet, dotenv, cors, xss, dompurify, cookie parser, 
   express rate limit, https, express brute, csrf, jwt, bcrypt, express validator, sequelize, express, react, react router
   dom, and axios. 

Mafia Codes
https://www.youtube.com/watch?v=USrMdBF0zcg
-> How to generate and use a SSL certificate in Nodejs

IIEVC School of Computer Science
https://www.youtube.com/watch?v=I4CyzX5rhLU
-> Setting up CircleCi and SonarQube 

React
https://react.dev/
-> Frontend Development

Nodejs
https://nodejs.org/en
-> Nodejs

Programming with Mosh
https://www.youtube.com/watch?v=SqcY0GlETPk&t=163s
-> React Tutorial for beginners

Programming with Mosh
https://www.youtube.com/watch?v=TlB_eWDSMt4&t=8s
-> Nodejs Tutorials for beginners

Programming with Mosh
https://www.youtube.com/watch?v=pKd0Rpw7O48
-> Nodejs and Expressjs

