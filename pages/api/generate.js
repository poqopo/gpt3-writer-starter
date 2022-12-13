import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const response = await openai.createImage({
    prompt: req.body.userInput,
    n: 3,
    size: "256x256",
  });
  res.status(200).json(response.data);
};

export default generateAction;
