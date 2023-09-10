//Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
import * as dotenv from "dotenv";
const env = dotenv.config();


import fs from 'fs'

//Load environment variables (populate process.env from .env file)
import { isEven, trim_array } from './utils'
import { footballAPI } from "./api-football.js";
import { chatCompletion } from "./service/openai.js";
import { functions } from "./functions.js";
import OpenAI from "openai";

import question from '../question.json'

  // system prompt as additional guard rail for function call
let function_system_prompt = `
    You're a helpful assistant finding all the information related to football teams and matches
    If the user wants to know the information about football team, or you need to find a team ID for another function, call get_teams function, which requires name or country as required parameters.
    If the user wants to know the results of the specific teams matches, call get_head_to_head_fixtures with the team1 and team2 ids as required parameters.
`

let messages = [
    { role: 'system', content: function_system_prompt },
    { role: 'user', content: question.text }
]

// Function calling response to API call
const callFunction = async (res: OpenAI.Chat.Completions.ChatCompletionMessage) => {
    const func_call = res
    if (!func_call.function_call?.name) { return }
    const { name, arguments: args } = func_call.function_call

    // only 2 endpoints supported atm
    const endpoint = name === 'get_teams' ? '/teams' : '/fixtures/headtohead'
    const func_args = JSON.parse(args)
    let api_params = {...func_args}
    if (endpoint === '/fixtures/headtohead') {
        api_params.h2h = `${func_args.team1}-${func_args.team2}`
        delete api_params.team1
        delete api_params.team2
    }
    const api_call = await footballAPI(endpoint, api_params)  
    const func_result = api_call.data.response[0]
    console.log(func_call, api_params, func_result)
    
    // final chat completions call with actual system prompt, history, function call result and api result
    // to summarize everything.

    return {
        func_call,
        name,
        func_result
    }
}

export const run = async () => {
//   const prev_data = []
  let result: OpenAI.Chat.Completions.ChatCompletionMessage

  console.log(messages)
  try {
      console.time('Function call');
      result = await chatCompletion({
          messages,
          functions
      })
      console.timeEnd('Function call')
  } catch(error) {
      console.log(error)
      process.exit(0)
  }

  let iterations = 0
  while (result.content === null) {
    iterations++
    if (iterations > 5) { return }
    const funcResults = await callFunction(result)
    // if(prev_data.length > 0) {
    //     messages = messages.concat(prev_data)
    // }
    if (!funcResults) { 
        console.log('no function call needed', result); 
        process.exit(0) 
    }
    const { func_call, name, func_result } = funcResults

    messages.push(func_call) // function call result
    console.log(messages[messages.length - 1])
    messages.push({"role": "function", "name": name, "content": JSON.stringify(func_result)})  
    console.log(messages[messages.length - 1])

    try {
        console.time('Function call');
        result = await chatCompletion({
            messages,
            functions
        })
        console.timeEnd('Function call')

    } catch(error) {
        console.log(error)
    }   
  };

  console.log('final', result)
}

run();
