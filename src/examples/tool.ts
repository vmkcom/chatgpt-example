import { ChatOpenAI } from "langchain/chat_models/openai";

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import {
  RequestsGetTool,
  RequestsPostTool,
  AIPluginTool,
} from "langchain/tools";

import * as dotenv from "dotenv";
dotenv.config();

export const run = async () => {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    await AIPluginTool.fromPluginUrl(
      "https://agones.gr/.well-known/ai-plugin.json"
    ),
  ];
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({ temperature: 0, modelName: 'gpt-4-0613' }),
    { agentType: "chat-zero-shot-react-description", verbose: true }
  );

  const result = await agent.call({
    input: "What is the score between last match of Everton and Wolves?",
  });

  console.log({ result });
};

run()