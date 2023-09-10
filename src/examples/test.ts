import * as fs from "fs";
import * as yaml from "js-yaml";
import { OpenAI } from "langchain/llms/openai";
import { JsonSpec, JsonObject } from "langchain/tools";
import { createOpenApiAgent, OpenApiToolkit } from "langchain/agents";
import * as dotenv from "dotenv";
dotenv.config();


export const run = async () => {
  let data: JsonObject;
  try {
    const yamlFile = fs.readFileSync("../football.yaml", "utf8");
    data = yaml.load(yamlFile) as JsonObject;
    if (!data) {
      throw new Error("Failed to load OpenAPI spec");
    }
  } catch (e) {
    console.error(e);
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    'x-apisports-key': `6a2ebf0bfe57befbe03765041d991643`,
  };
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-4-0613' });
  const toolkit = new OpenApiToolkit(new JsonSpec(data), model, headers);
  const executor = createOpenApiAgent(model, toolkit);

  const input = `Who won the last match between Everton and Wolves`;
  console.log(`Executing with input "${input}"...`);
  executor.verbose = true
  const result = await executor.call({ input });
  console.log(`Got output ${result.output}`);

  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2
    )}`
  );
};

run()