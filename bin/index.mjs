#! /usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output, env } from "node:process";
import dotenv from "dotenv";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import chalk from "chalk";
import figlet from "figlet";


dotenv.config();

const readline = createInterface({ input, output });
const chat = new ChatOpenAI({ temperature: 0 });
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: chat, memory: memory });


const main = async() => {

  await figlet("Leslie Assitant", async function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.green(data));
    console.log("\n" + chalk.blueBright("Let's work together") + "\n");
    await startLes();
  });
}

const startLes = async() => {
  const intro = await chain.call({
    input: "Hey!",
  });
  
  let userInput = await readline.question(chalk.green(intro.response) + "\n\n");

while (userInput !== "q") {

  try {
    
      
      const response = await chain.call({
        input: userInput,
      });
      
  
      let botMessage =  await response.response;
      if (botMessage) {
        
        userInput = await readline.question("\n" + chalk.green(botMessage) + "\n\n");
      } else {
        userInput = await readline.question("\nNo response, try asking again\n");
      }
    } catch (error) {
      console.log(error.message);
      userInput = await readline.question("\nSomething went wrong, try asking again\n");
    }
  }
  
  readline.close();
}

main();
