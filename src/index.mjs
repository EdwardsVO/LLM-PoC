import { OpenAI } from "langchain/llms/openai";
import dotenv from "dotenv";
dotenv.config();


const main = async () => {

const llm = new OpenAI({
    // openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 1,
  });

  const result = await llm.predict("Cual sería un buen nombre para una compañia que hace soluciones web3 financieras para defi, innovadora");
  console.log(result);
}

main();