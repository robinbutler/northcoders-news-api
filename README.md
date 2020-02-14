# Northcoders News API

**API designed to host and serve data for a reddit style news website**

## Link to the API

https://robins-nc-news-host.herokuapp.com/

### Core Routes

This server has the following endpoints:

```http
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

---

## Download instructions and getting started

### Step 1 - Downloading your own repository

Clone this repo:

```bash
git clone :https://github.com/robinbutler/northcoders-news-api
```

### Step 2 - Creating your own knexfile

In order for the database to be able to use postgress and run multiple testing environments you will have to create your own knex file. In the root directory create a new file called **knexfile.js**.

Within that file add the following information:

```bash
const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news"
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

This allows heroku to use the dev data when displaying information, but testing will be run on the test data instead.

#### Linux users

Linux users will have to provide postgress with a username and password to access the data this can be done by typing the following into the command terminal

```bash
/northcoders-news-api$ export = PGUSERNAME='your username here'

/northcoders-news-api$ export = PGPASSWORD='your password here'

/northcoders-news-api$ clear
```

This adds your credentials to the command terminal for as long as it stays open and prevents you from accidentally added them to your github repo

### Step 3 - Installing dependencies and setting up

While in northcoders-news-api run npm install to install all programs necassary for running and accessing the server

```bash
/northcoders-news-api$ npm install
```

To create the database's and seed the data in them, use the run setup-dbs and seed scripts.

```bash
/northcoders-news-api$ npm setup-dbs

/northcoders-news-api$ npm run seed
```

To then move to the latest migration of the dataset use the run migrate-latest command

```bash
/northcoders-news-api$ npm run migrate-latest
```

### Step 4 - Running testing on the API

Testing is run on a test database and can be done by running the npm test command

```bash
/northcoders-news-api$ npm test
```

---

## Built with

- [Javasctipt](https://www.javascript.com/) - Scripting language
- [Express](https://expressjs.com/) - Web framework
- [Chai](https://www.npmjs.com/package/chai) - Assertion framework
- [Mocha](https://www.npmjs.com/package/mocha) - Testing framework
- [Supertest](https://www.npmjs.com/package/supertest) - HTTP testing framework
- [Knex](http://knexjs.org/) - Query builder
- [Postgress](https://www.npmjs.com/package/pg) - SQL client

---

## Requirements

- Node ver 13.8.0
- Node Postgress ver 7.18.1

---

## Author

[Robin_Butler](https://github.com/robinbutler)

---
