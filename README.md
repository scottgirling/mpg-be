# Meal Plan Generator API

If you would like to try out the hosted version, visit: https://mpg-be.onrender.com/api

The '/api' path takes you to a list of all available endpoints. 
Here you will find a description, list of available queries, example path with queries (if applicable) and an example response.

Project Summary:
An API built to programmatically access data, featuring full CRUD functionality on a dataset built up of recipes, users and tags.
The project offers a real-world backend service which can provide information to frontend architecture.
Built with an Express server and a PostgreSQL database, this project encompasses seeding, integration testing, error handling and complex queries.

How to get set-up:

Cloning the repository:
1) Copy the repository's URL and open the command line.
2) Change the current working directory to the desired location for the cloned repository.
3) Clone the repository by running the 'git clone' command, pasting the previously copied URL and press Enter.
4) Open to repository in a text editor.

Installing dependencies:
1) Navigate to your project directory in the terminal.
2) Run the command 'npm install' which will read the 'package.json' file and download all the listed dependencies.

How to seed local databases:
1) Inside the './db/data' folder, there are two sets of data available: test-data and development-data. These are used to seed two different databases.
2) Run the 'npm run setup-dbs' command to DROP and CREATE these databases, ready for seeding.
3) Run the 'npm run seed' command to populate these databases with data. You will have access to different datasets depending on your environment (test or development).

How to run tests:
1) To run all tests together, run the 'npm t' command. This will run run tests from the '__tests__/app.test.js' and '__tests__/utils.test.js' files at the same time.
2) If you would prefer to run these files in isolation, run the command 'npm t app' or 'npm t utils'.
3) If you want to run an individual test, change 'test' to 'test.only' on the appropriate test in the relevant test file.

Adding environment variables:
1) You will need to create the following environment variables:
- PGDATABASE=mpg inside a .env.development file at the root level of the repository
- PGDATABASE=mpg_test inside a .env.test file at the root level of the repository
2) These will be automatically added to your .gitignore (but it's always worth double checking!)

Minimum versions to ensure functionality:
- Node.js: v22.9.0
- Postgres: 8.7.3