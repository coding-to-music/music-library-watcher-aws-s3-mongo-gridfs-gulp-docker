import dotenv from "dotenv";
dotenv.config();

// Create service client module using ES6 syntax.
import { S3Client } from "@aws-sdk/client-s3";

// Set the AWS Region.
const REGION = process.env.REGION;
// Create an Amazon S3 service client object.

const s3Client = new S3Client({ region: REGION });
export { s3Client };

// import { s3MusicService } from "./model/services/s3MusicService.js";
import s3MusicService from "./model/services/s3MusicService";

// Import required AWS SDK clients and commands for Node.js.
import { ListObjectsCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "./libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.

// Create the parameters for the bucket
export const bucketParams = { Bucket: process.env.NAME_OF_BUCKET };

var processing = false;

console.log("Polling S3 for new tracks at 1 minute intervals..");
setInterval(function () {
  if (!processing) {
    processing = !processing;

    // export const run = async () => {
    //   try {
    //     const data = await s3Client.send(new ListObjectsCommand(bucketParams));
    //     console.log("Success", data);
    //     return data; // For unit tests.
    //   } catch (err) {
    //     console.log("Error", err);
    //   }
    // };
    // run();

    s3MusicService
      .getTracksInS3()
      .then(function (trackKeys) {
        s3MusicService
          .identifyTrackChanges(trackKeys, 0)
          .then(function (newTracks) {
            if (newTracks.length > 0) {
              console.log(
                "Total of [" +
                  newTracks.length +
                  "] new tracks found, processing.."
              );
              s3MusicService
                .updateDatabaseModel(newTracks, 0, function () {
                  processing = false;
                  console.log("Processing complete, sleeping..\n");
                })
                .catch(function (error) {
                  console.error(error, error.stack);
                });
            }
          });
      })
      .catch(function (error) {
        console.error(error, error.stack);
      });
  }
}, 1000 * 60);
