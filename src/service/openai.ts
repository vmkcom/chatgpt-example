import OpenAI from 'openai';
import * as dotenv from "dotenv";
const env = dotenv.config();

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
}

const openai = new OpenAI(configuration)

export async function chatCompletion({
    model = 'gpt-4-0613',
    max_tokens = 1024,
    temperature = 0,
    messages,
    functions,
    function_call = 'auto',
}): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    try {

        const result = await openai.chat.completions.create({
            messages,
            model,
            max_tokens,
            temperature,
            functions,
            function_call,
        })

        if (!result.choices[0].message) {
            throw new Error("No return error from chat");
        }

        return result.choices[0].message //?.content

    } catch(error) {
        console.log(error)
        throw error
    }
}