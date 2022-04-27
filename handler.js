const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/logger');
const user = require(appRoot + '/src/routes/user');
const location = require(appRoot + '/src/routes/location');

const app = express();

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.route("/user")
    .get(user.getCollectionUser)
    .post(user.createUser);
app.route("/user/:PK")
    .get(user.getSingleUser);
app.route("/user/updateinventory")
    .post(user.updateInventory);

app.route("/location")
    .get(location.getCollectionLocation)
    .post(location.createLocation);
app.route("/location/:PK")
    .get(location.getSingleLocation)

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);