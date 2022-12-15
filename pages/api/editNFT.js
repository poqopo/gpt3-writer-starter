import { Configuration, OpenAIApi } from "openai";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { makeNFT } from "../utils/contract";

const awsAccessKey = process.env.MY_AWS_ACCESS_KEY;
const awsSecretKey = process.env.MY_AWS_SECRET_KEY;
const awsS3Bucket = process.env.MY_AWS_S3_BUCKET;
const awsS3BucketRegion = process.env.MY_AWS_S3_BUCKET_REGION;

// s3 클라이언트 연결
const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
  region: awsS3BucketRegion,
});

async function getSignedFileUrl(data) {
  const params = {
    ACL: "public-read",
    Bucket: awsS3Bucket,
    Key: data.name,
  };
  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, {
    expiresIn: 15,
  });
  return url;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function uploadImg(address, data) {
  try {
    const body = {
      name: "image/edit" + address,
      ContentEncoding: "base64",
      ContentType: "image/png",
    };
    const signedUrl = await getSignedFileUrl(body);
    const uploadImage = await axios.put(signedUrl, data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const generateAction = async (req, res) => {
  var changedData = Buffer.from(
    req.body.mask.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const result = await uploadImg(req.body.selectedAddress, changedData);

  const response = await openai.createImageEdit({
    image: changedData,
    prompt: req.body.userInput,
    n: 3,
    size: "256x256",
  });
  res.status(200).json(3);
};

export default generateAction;
