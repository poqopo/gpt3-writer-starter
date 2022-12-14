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
    Bucket: awsS3Bucket,
    Key: data.name,
  };
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3, command, {
    expiresIn: 15,
  });
  return url;
}
async function getImg(address) {
  try {
    const body = {
      name: "image/" + address,
      type: result.headers["content-type"],
    };
    const signedUrl = await getSignedFileUrl(body);
    const getImage = await axios.get(signedUrl, {
      headers: {
        "content-type": result.headers["content-type"],
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}
const generateAction = async (req, res) => {
  if (req.query.userAddress !== "undefined") {
    const result = await getImg(req.query.userAddress);
    res.status(200).json(result);
  }
  res.status(400);
};
export default generateAction;
