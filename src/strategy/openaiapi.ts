import log from "../logger/log";
import { GptAPI } from "./api";
import { CompletionRequest, CompletionProvider } from "./strategy";
import { AxiosRequestConfig } from "axios";

import {
  ChatCompletionRequestMessage,
  ChatCompletionRoleEnum,
} from "./conversationspec";

export default class OpenAIAPIProvider
  extends GptAPI
  implements CompletionProvider
{
  #timeout: BigInt;
  defaultCompletionModel: string;
  defaultChatCompletionModel: string;
  defaultEditModel: string;

  constructor(
    apiKey: string,
    timeout: BigInt,
    defaultCompletionModel: string = "text-davinci-003",
    defaultChatCompletionModel: string = "gpt-3.5-turbo",
    defaultEditModel: string = "code-davinci-edit-001",
    headers: Record<string, string> = {}
  ) {
    const origin = "https://api.openai.com";
    const endpoint = "/v1";
    const apiKeyHeaderKey = "Authorization";
    const defaultHeaders: Record<string, string> = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "content-type": "application/json",
    };
    super(origin, endpoint, apiKey, apiKeyHeaderKey, {
      ...defaultHeaders,
      ...headers,
    });
    this.#timeout = timeout;
    this.defaultCompletionModel = defaultCompletionModel;
    this.defaultChatCompletionModel = defaultChatCompletionModel;
    this.defaultEditModel = defaultEditModel;
  }

  async completion(input: CompletionRequest) {
    return this.chatCompletion(input);
  }

  async chatCompletion(input: CompletionRequest) {
    // return tempCodeString;
    // let messages: ChatCompletionRequestMessage[] = [{"role": "user", "content": "Hello!"}];
    if (!input.messages) {
      throw Error("No input messages found");
    }
    let chatModel: boolean = false;
    if (input.model.startsWith("gpt-3.5") || input.model.startsWith("gpt-4")) {
      chatModel = true;
    }
    let stoparg: string | string[] = "";
    if (input.stop) {
      stoparg = input.stop;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let request: Record<string, any> = {
      model: input.model,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      max_tokens: input.maxTokens,
      temperature: input.temperature,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      top_p: input.topP,
      n: input.n,
      stream: false,
      stop: stoparg,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      presence_penalty: input.presencePenalty,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      frequency_penalty: input.frequencyPenalty,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      logit_bias: input.logitBias,
      user: input.user,
    };

    if (chatModel) {
      request.messages = input.messages;
    } else {
      request.prompt = input.prompt;
      request.suffix = input.suffix;
      request.best_of = input.bestOf;
      request.echo = input.echo;
      request.logprobs = input.logprobs;
      request.max_tokens = input.maxTokens ? input.maxTokens : 2048;
    }

    let modelpath = "/completions";
    if (chatModel) {
      modelpath = "/chat/completions";
    }
    const requestConfig: AxiosRequestConfig = {
      url: modelpath,
      method: "POST",
      data: request,
    };
    try {
      const data = await this.request(requestConfig);
      let fullResponse = data;
      if (typeof data !== "object" || data === null) {
        throw new Error("Invalid data response. Expected an object." + data);
      }
      let respText = "";
      if (
        "choices" in data &&
        Array.isArray(data.choices) &&
        data.choices.length > 0
      ) {
        if (chatModel) {
          respText = data.choices[0].message?.content as string;
        } else {
          respText = data.choices[0].text ? data.choices[0].text : "";
        }
      }
      return { fullResponse: fullResponse, data: respText };
    } catch (error) {
      throw error;
    }
  }

  public checkAndPopulateCompletionParams(
    prompt: string | null,
    messages: Array<ChatCompletionRequestMessage> | null,
    inputParams?: { [key: string]: any }
  ): CompletionRequest {
    let model =
      (inputParams?.model as string) || this.defaultChatCompletionModel;
    let chatModel: boolean = false;
    if (model.startsWith("gpt-3.5") || model.startsWith("gpt-4")) {
      chatModel = true;
    }
    let completionRequest: CompletionRequest = {
      model: model,
      prompt: prompt,
      messages: messages,
      suffix: inputParams?.suffix || undefined,
      maxTokens: inputParams?.maxTokens,
      temperature:
        inputParams?.temperature === 0 ? 0 : inputParams?.temperature || 0.1,
      topP: inputParams?.topP === 0 ? 0 : inputParams?.topP || undefined,
      n: inputParams?.n === 0 ? 0 : inputParams?.n || undefined,
      stream: false,
      logprobs:
        inputParams?.logprobs === 0 ? 0 : inputParams?.logprobs || undefined,
      echo: (inputParams?.echo as boolean) || undefined,
      stop: inputParams?.stop || undefined,
      presencePenalty:
        inputParams?.presencePenalty === 0
          ? 0
          : inputParams?.presencePenalty || 0.0,
      frequencyPenalty:
        inputParams?.frequencyPenalty === 0
          ? 0
          : inputParams?.frequencyPenalty || 0.5,
      bestOf: inputParams?.bestOf === 0 ? 0 : inputParams?.bestOf || 1,
      logitBias: inputParams?.logitBias || undefined,
      user: (inputParams?.user as string) || undefined,
    };

    if (completionRequest.prompt) {
      let message: ChatCompletionRequestMessage = {
        role: ChatCompletionRoleEnum.user,
        content: completionRequest.prompt,
      };
      if (!completionRequest.messages) {
        completionRequest.messages = [message];
      } else {
        completionRequest.messages.push(message);
      }
    }
    if (chatModel && completionRequest.messages) {
      completionRequest.prompt = null;
    }
    return completionRequest;
  }
}
