import { env } from "@/env";

const admin = require("firebase-admin");
const serviceAccountKey = require("../../../firebase-key.json");

//initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  storageBucket: env.STORAGE_BUCKET, //you can find in storage.
});

//get your bucket
var bucket = admin.storage().bucket();

//function to upload file
export async function uploadFile(file: any, fileName: string) {
  await bucket.file(fileName).createWriteStream().end(file.buffer);
}

export async function generateSignedUrl(fileName: string) {
  const options = {
    version: "v2",
    action: "read",
    expires: Date.now() + 1000 * 60 * 60,
  };

  const [url] = await bucket.file(fileName).getSignedUrl(options);
  return url;
}
