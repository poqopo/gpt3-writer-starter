import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.accesskeyId,
    secretAccessKey: process.env.secretKeyId,
  },
  region: process.env.bucketRegion,
});

const baseMetadta = {
  name: "For Example #0",
  description: "Test for NFT description",
  image: "https://bigdata-policing.kr/0.png",
  attributes: [],
};

const generateAction = async (req, res) => {
  const metadata = { ...baseMetadta, image: req.body.imgUrl };
  console.log(metadata);
};

export default generateAction;
