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

async function uploadMetadata(address, description) {
  const baseUrl = "https://poqopotest.s3.us-west-2.amazonaws.com/image/";
  const metadata = {
    name: "Profile NFT",
    description: description,
    image: baseUrl + address,
    attributes: [],
  };

  try {
    const body = {
      name: "json/" + address,
      type: "application/json",
    };
    const signedUrl = await getSignedFileUrl(body);
    const uploadMetadata = await axios.put(signedUrl, metadata);
  } catch (e) {
    console.log(e);
  }
  return true;
}

async function uploadImg(url, address) {
  const result = await axios.get(url, {
    responseType: "arraybuffer",
  });
  try {
    const body = {
      name: "image/" + address,
      type: result.headers["content-type"],
    };
    const signedUrl = await getSignedFileUrl(body);
    const uploadMetadata = await axios.put(signedUrl, result.data, {
      headers: {
        "content-type": result.headers["content-type"],
      },
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const generateAction = async (req, res) => {
  const result = await uploadImg(req.body.imgUrl, req.body.userAddress);
  const metadataResult = await uploadMetadata(
    req.body.userAddress,
    req.body.description
  );
  if (req.body.userAddress) {
    makeNFT(req.body.userAddress);

    return;
  }
};

export default generateAction;
