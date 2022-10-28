// require("dotenv").config();
// import {} from "dotenv/config";

import dotenv from "dotenv";
dotenv.config();

// Create service client module using ES6 syntax.
import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = process.env.REGION;
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });
export { s3Client };

// Import required AWS SDK clients and commands for Node.js.
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.

// Create the parameters for the bucket
export const bucketParams = { Bucket: process.env.NAME_OF_BUCKET };

export const run = async () => {
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
run();
