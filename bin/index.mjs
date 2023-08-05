#! /usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output, env } from "node:process";
import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";
import { startLes } from "./conversational.mjs";


import yargs from "yargs";
import { hideBin } from 'yargs/helpers'

dotenv.config();

const readline = createInterface({ input, output });



const main = async() => {

  await figlet("Leslie Assitant", async function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.green(data));
    console.log("Alpha Version")
    console.log("\n" + chalk.blueBright("Let's work together") + "\n");
    await start();
  });
}

const start = async() => {

  yargs(hideBin(process.argv))
  .command('c', 'Start conversation', () => {}, (argv) => {
    startLes(readline);
  })
  .command('t', 'Start thesis mode', () => {}, (argv) => {
    console.info(argv)
  })
  .demandCommand(1)
  .parse()
  
}

main();
