
# international payments portal

# the certs folder would not be pushed to git and would be in the .gitignore in a production environment, it is included for ease of running the app due to difficulty with having https configured for development, seperated certs will be used for "production"

# prerequisites: IDE for javascript developement (ideally VS Code), MySQL database created (see instructions for further guidance), node installed (goto https://nodejs.org/en and install for your machine), JWT_SECRET generated(use this command in your terminal after installing node--> node -e "console.log(require('crypto').randomBytes(64).toString('hex')); the reult is your JWT_SECRET which youll have in your .env file, see instructions for further guidance"


# instructions to run

1) download project zip file
   
2) open project using chosen IDE for javascript development (ideally VS Code, where this proejct was completed
   
3) create .env file in backend directory, add the following in the file:
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD= (add your password for mysql connection)
MYSQL_DATABASE=international_payments_portal (you will have to create this database in MySQL, use the exact name here)
JWT_SECRET= (generate a jwt secret and place it here)
PORT=443
NODE_ENV=development
ALLOWED_ORIGINS=https://localhost:3000
HTTPS=true

4) create a .env file in customer-portal directory, add the following in the file:
HTTPS=true

5) open a terminal and use the following commands to run the backend server and the frontend, 1) navigate to backend using this command, copy the contents within the brackets and not the brackets themself (cd customer-portal\backend), and then use the command within the brackets to start the backend server (npm start). 2) open another terminal and use the following command to navigate to the frontend (cd customer-portal), and then use the command (npm start). your frontend will open in your default or open browser.

# step 5 assumes that node is now properly installed on your machine, the commands wont work if it isnt. it also assumes your project is properly configured as per the instructions and you are at the root of the project.

6) the browser will say the certificate is invalid due it being self-signed, ignore this and click "advanced" and then "proceed"

# dont enter any sensitive information, only mock data for the sake of testing functionality

7) The app will now run and you can use it.
