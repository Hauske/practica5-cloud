import { Request, Response } from "express";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutItemCommand,
  ScanCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE!;

class VehicleController {
  async createVehicle(req: Request, res: Response) {
    const id = uuidv4();
    const { make, model, year } = req.body;

    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        id: { S: id },
        make: { S: make },
        model: { S: model },
        year: { N: year.toString() },
      },
    });

    await client.send(command);
    res.status(201).json({ id, make, model, year });
  }

  async getVehicles(req: Request, res: Response) {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const result = await client.send(command);

    const vehicles = result.Items?.map(item => ({
      id: item.id.S,
      make: item.make.S,
      model: item.model.S,
      year: parseInt(item.year.N || "0"),
    })) || [];

    res.json(vehicles);
  }

  async getVehicleById(req: Request, res: Response) {
    const { id } = req.params;

    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
    });

    const result = await client.send(command);

    if (!result.Item) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const vehicle = {
      id: result.Item.id.S,
      make: result.Item.make.S,
      model: result.Item.model.S,
      year: parseInt(result.Item.year.N || "0"),
    };

    res.json(vehicle);
  }

  async updateVehicle(req: Request, res: Response) {
    const { id } = req.params;
    const { make, model, year } = req.body;

    const command = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: "SET make = :make, model = :model, year = :year",
      ExpressionAttributeValues: {
        ":make": { S: make },
        ":model": { S: model },
        ":year": { N: year.toString() },
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await client.send(command);

    const updatedVehicle = {
      id,
      make: result.Attributes?.make.S,
      model: result.Attributes?.model.S,
      year: parseInt(result.Attributes?.year.N || "0"),
    };

    res.json(updatedVehicle);
  }

  async deleteVehicle(req: Request, res: Response) {
    const { id } = req.params;

    const command = new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
    });

    await client.send(command);
    res.status(204).send();
  }
}

export default new VehicleController();
