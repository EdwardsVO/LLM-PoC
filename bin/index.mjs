#! /usr/bin/env node
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output, env } from "node:process";
import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";
import { startLes } from "./conversational.mjs";
import { qa } from "./qa.mjs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

dotenv.config();

const readline = createInterface({ input, output });

const main = async () => {
  await figlet("Leslie Assitant", async function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.green(data));
    console.log("Alpha Version");
    console.log("\n" + chalk.blueBright("Let's work together") + "\n");
    await start();
  });
};

const start = async () => {
  yargs(hideBin(process.argv))
  .command('start', 'Start conversation', () => {}, (argv) => {
    if (argv.conversation == '') {
      console.log(chalk.red("Starting Conversation Mode" + "\n"));
      startLes(readline);
    }
    else if(argv.thesis == '') {
      console.log(chalk.red("Starting Thesis mode" + "\n"));
      qa(readline);
    }
  })
  .option('thesis', {
    alias: 't',
    type: 'string',
    description: 'Run thesis mode, with all archives preloaded'
  })
  .option('conversation', {
    alias: 'c',
    type: 'string',
    description: 'Run conversation helper mode'
  })

  .demandCommand(1)
  .parse()
};

main();
