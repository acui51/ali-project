Mac Instructions:

Git clone this into desired directory using
`git clone <insert link>`

Install Homebrew if not already installed on your computer using
`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`

INSTALLING MONGODB:

1. Install MongoDB Homebrew tap through Homebrew by running
   `brew tap mongodb/brew`

2. Install MongoDB through Homebrew by running
   `brew install mongodb-community@4.2`

3. Create a directory to store your MongoDB databases for the future (e.g. `~/MongoDB`)

4. Run the MongoDB server with the command `mongod --dbpath=PATH_TO_YOUR_DB_DIRECTORY`

5. Open a MongoDB shell by running `mongo` in another terminal session

5a. In your MongoDB shell, create a database to store the web app information locally. Do this by running `use <insert database name>`

5b. Create 4 collections within this database by running (might not need to do this):
`db.createCollection("users")`  
`db.createCollection("questions")`  
`db.createCollection("applications")`  
`db.createCollection("projects")`

RUNNING THE WEB APP:

1. If you already have npm, skip this step. If not, install the latest version of NodeJS. (LTS version)

2. `cd` into the directory you cloned this repository. Run `npm install`

3. Run these 4 commands <em>in the directory<em> you cloned this rep, NOT the MongoDB shell. This will install data into your local MongoDB database (i.e. some small projects, the questions, etc)

`mongoimport --db <insert database name> --collection users --file usersExport.json`  
`mongoimport --db <insert database name> --collection projects --file projectsExport.json`  
`mongoimport --db <insert database name> --collection applications --file applicationsExport. json`
`mongoimport --db <insert database name> --collection questions --file questionsExport.json`

4. Open the `index.js` file in the `api` directory:
   Change line 7 `let DATABASE_NAME = "193x_project";` to `let DATABASE_NAME = "<insert database name>";` using the database you created in your local MongoDB server.

5. Run `npm start` and navigate to `localhost:1930`
