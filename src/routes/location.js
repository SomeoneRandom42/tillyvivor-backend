const AWS = require("aws-sdk");

const DYNAMO_TABLE = process.env.DYNAMO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

async function getSingleLocation(req, res) {
    const params = {
        TableName: DYNAMO_TABLE,
        Key: {
          PK: "location~" + req.params.PK,
          SK: "location~"
        },
    };
    try {
      const { Item } = await dynamoDbClient.get(params).promise();
      if (Item) {
        res.json(Item);
      } else {``
        res
          .status(404)
          .json({ error: 'Could not find location ' + req.params.PK });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not retreive entities" });
    }
  };
  
async function getCollectionLocation(req, res) {
    const params = {
        TableName: DYNAMO_TABLE,
        ExpressionAttributeValues: {":locationpk":"location~"},
        FilterExpression: "begins_with(PK, :locationpk)"
    };
    try {
        const result = await dynamoDbClient.scan(params).promise();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to retreive locations" });
    }
};

async function createLocation(req, res) {
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
      res.status(500).json({ error: "Could not create location" });
    }
  };

module.exports = { getSingleLocation, getCollectionLocation, createLocation }