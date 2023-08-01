import { OpenAI } from "langchain/llms/openai";
import dotenv from "dotenv";
dotenv.config();


export const main = async (question) => {

const llm = new OpenAI({
    // openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
  });

  const result = await llm.predict(question);
  console.log(result);

}

main();