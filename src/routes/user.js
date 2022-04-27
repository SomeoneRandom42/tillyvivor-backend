const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

async function getSingleUser(req, res) {
    const params = {
      TableName: DYNAMO_TABLE,
      Key: {
        PK: "user~" + req.params.PK,
        SK: "profile~" + req.params.PK
      }
    };
    try {
      const { Item } = await dynamoDbClient.get(params).promise();
      if (Item) {
        res.json(Item);
      } else {``
        res
          .status(404)
          .json({ error: 'Could not find user ' + req.params.PK });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not retreive entities" });
    }
  };
  
  async function getCollectionUser(req, res) {
    const params = {
        TableName: DYNAMO_TABLE,
        ExpressionAttributeValues: {
            ":profilesk":"profile~",
            ":userpk":"user~"
        },
        FilterExpression: "begins_with(PK, :userpk) AND begins_with(SK, :profilesk)"
    };
    console.log(req);
    try {
        const result = await dynamoDbClient.scan(params).promise();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to retreive locations" });
    }
};



async function createUser(req, res) {
    const { PK, SK } = req.body;
    const item = {...req.body};
    console.log(req.body)
    if (typeof PK !== "string") {
      res.status(400).json({ error: '"PK" must be a string' });
    } else if (typeof SK !== "string") {
      res.status(400).json({ error: '"SK" must be a string' });
    }
  
    const params = {
      TableName: DYNAMO_TABLE,
      Item: item,
    };
  
    try {
      await dynamoDbClient.put(params).promise();
      res.json({ ...item });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not create user" });
    }
  };

async function updateInventory(req, res) {
    const update = {...req.body};
    console.log(update)
    if (typeof update.PK !== "string") {
      res.status(400).json({ error: '"PK" must be a string' });
    } else if (typeof update.SK !== "string") {
      res.status(400).json({ error: '"SK" must be a string' });
    }
    
    const getparams = {
        TableName: DYNAMO_TABLE,
        Key: {
          PK: update.PK,
          SK: update.SK
        }
      };

    let User = { ...(await dynamoDbClient.get(getparams).promise()).Item };
    console.log(User);
    console.log('update inventory\n', update.inventory)

    if(User){
        for (const [key, value] of Object.entries(update.inventory)) {
            User.inventory[key] += value;
        }
        const updateparams = {
            TableName: DYNAMO_TABLE,
            Item: User,
        };        
        console.log(User);
        try {
            await dynamoDbClient.put(updateparams).promise();
            res.json({ ...User });
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not create user" });
        }
    }
    else{
        console.log(error);
        res.status(500).json({ error: "Could not find user " + update.name });
    }

    
  };


module.exports = { getSingleUser, getCollectionUser, createUser, updateInventory }
