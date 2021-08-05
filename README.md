# Ask Me Anything Server

The server part for **Ask Me Anything**.

Ask Me Anything Server provides a RESTful API for the client part and handles data with [MongoDB](https://www.mongodb.com).

## Data structure

```json
{
  "_id": "ObjectId",
  "question": {
    "content": "String",
    "date": "Date"
  },
  "answer": {
    "content": "String",
    "date": "Date"
  },
  "visibility": "Boolean"
}
```

## Methods supported

### `/questions`

`GET`:

- get all entries when `isAdmin = true`
- cannot get the entries with `visibility: false` when `isAdmin = false`

`POST`

- post a new entry with `question.content` provided

- `question.date` is calculated on server and `visibility` is set to `false`

- no entry will be posted to the database if `question.content` is empty

`DELETE`

- delete all entries when `isAdmin = true`

### `/questions/:questionId`

`GET`

- get an entry with `_id` matching `:questionId` when `isAdmin = true`

- cannot get the entry with `visibility: false` when `isAdmin = false`

`PUT`:

- replace an entry with `_id` matching `:questionId` when `isAdmin = true`

- `question.date` is calculated on server if `question.content` is provided

- `answer.date` is calculated on server if `answer.content` is provided

- `visibility` is set to `false` if not provided

`PATCH`

- update an entry with `_id` matching `:questionId` when `isAdmin = true`

- `question.date` is calculated on server if `question.content` is updated

- `answer.date` is calculated on server if `answer.content` is updated

`DELETE`

- delete an entry with `_id` matching `:questionId` when `isAdmin = true`

## Configurations

`isAdmin` is used for `GET` method of entries with `visibility: false` and `DELETE`, `PUT`, `PATCH` methods.

A `.env` file is needed to provide database information and port information.

## TODO

- [ ] Add authentications to filter out robots.

- [ ] Add authentications to replace `isAdmin`.
