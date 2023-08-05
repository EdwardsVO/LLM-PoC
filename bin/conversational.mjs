#! /usr/bin/env node
import { stdin as input, stdout as output, env } from "node:process";
import dotenv from "dotenv";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import chalk from "chalk";
dotenv.config();

const chat = new ChatOpenAI({ temperature: 0 });
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: chat, memory: memory });


export const startLes = async(readline) => {
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
