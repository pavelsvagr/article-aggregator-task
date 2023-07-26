# Article aggregator API

You have a database ready in a docker image with the necessary schema and a script to seed the data. The current code
represents a JSON API implemented as a simple HTTP server with multiple endpoints that allow users to fetch data.  
Your goal is to perform various tasks over this codebase to optimize it or add new functionalities.

## Setup

### Database

Start the database

```sh
$ cd docker-compose
$ docker-compose up
```

This will create and start the database and prepare the schema.
You can read the connection details in `./docker-compose/docker-compose.yml`.

### Database data

```sh
$ npm i
$ npm run seed-data
```

Inspect the database now. We have tables `users`, `publishers`, `articles`, `topics` and `articles_topics`.
The main table for our app is `articles` which stores data about articles from multiple sources that are
represented with table `publishers`. Articles and publishers have a state which defines if they should be shown in the
app or not.
Each article can have max one author that is defined in the table `users` and some `topics` defining what is the article
about.

![](https://www.plantuml.com/plantuml/png/JSwn3G8n30NGtbDu0QvXWMC32XWWn8PO93dBzXK8iJj1877L_th5rvyzaiNQAXGXnYoMAtyxDuq7Dewoa6_fAbo7WD-bQxBKK1EHz1lk0SxEXjCJ3nRocVeblgQ1fqKb_sc7n_LInGiRpDnft7W3)

### Start the server

After you build the source code, the server will start listening on `http://localhost:3000/api`, all possible routes can
be found in [server.ts](src/server.ts) file.

```sh
npm run build
npm run start
```

## Tasks

Complete as many tasks as possible in time. The best approach is to read all the tasks and pick the easiest one for you at the beginning. Start with the simple solution, and improve it if you have some time left.
If you struggle with something, describe steps you did or what you think can lead to the right solution in the `SOLUTION.md` file.

Directly update the code in this repository and use git to version your changes. Put somewhere in the commit message
reference to the task number e.g.

```
{commit_message} 

Related: #{number_of_the_task}
```

If you run some SQL or Typescript scripts, that modify database tables or data to complete the task, put them also in the `SOLUTION.md` file,
or in separate folder and mention them in md file.
If you tried to modify the database and something went wrong, it is faster to delete the docker container
and run the docker and database setup again from step 1.
You don't need to use RAW SQL statements and use more convenient Knex query builder, RAW statements are here
just for you to understand the task quickly.

## 1. Invalid data

The client reported that some of the articles have duplicated topics (e.g. article has two topics with the title `sport`).
Let's assume that all the articles are imported to the database by another service, and we already fixed this issue
there. This means all articles that will be imported in the future won't have this issue, but current data have.

**Task**

1. Fix this issue, so API returns for every article each topic with the same id only once.

## 2. Endpoint optimization

Endpoint for the newest articles does not perform well. You can see that using ` GET /v1/articles` which
should return you the values in time above 1s (performance depends on your system)

**Task**
1. Inspect the code behind the `articles` endpoint to find out what is wrong and describe the steps you followed (.txt, .md
   file)
2. Implement an optimization for the current solution, so we will get the result much faster (300ms is okay, but it is doable under 50ms)

**Notes**

- Current database expects to have many inserts during the day. We want to always provide users with the current database state when
  they request the endpoint
- Don't optimize usage of limit/offset parameters. We want to optimize only the query with default parameters

## 3. Implement topic articles endpoint

The client wants to have a new endpoint that will return **10 newest articles** for some topic (newest = ordered
by `publish_time`). This topic **needs to be active**.
We also want only those articles which were published by **active publishers** and were **already published**.
The client also wants to have an opportunity to filter out articles that have no author.

**Task**

1. Implement the endpoint that accepts path parameter `topic_id` and returns articles defined in the description
2. If the topic with the given `topic_id` isn't active, respond with an HTTP `Not Found` code.
3. Add a boolean query parameter `onlyWithAutor` that will filter out the articles without the author
4. Enrich articles with relations (topics, publishers, author) similar to the `/v1/articles` endpoint

**Note**
- You can use whatever you want. If you use a new package.json dependency, describe the reason in the `SOLUTION.md` file

## 4. Error handling

The current solution hasn't a proper error handling. You can see that using the endpoint for
the newest articles list with zero page: `GET /v1/articles?page=0`.

**Task**

1. Implement a global error handling system that prevents the server to stop working
2. Every error should be logged in console
3. Send the user some error object, so he knows that something is not correct

**Notes**

- Don't implement any input validation for the `page` parameter
