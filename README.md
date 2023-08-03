# FlexiGPT

[Full Documentation site](https://pankajpipada.com/flexigpt/#/)

---

# Table of Contents

* [Introduction](#Introduction)
* [Getting started](#Getting-started)
	* [Installation](#Installation)
	* [Configuration](#Configuration)
		* [FlexiGPT level configuration](#FlexiGPT-level-configuration)
		* [Sample Full configuration](#Sample-Full-configuration)
* [AI Providers](#AI-Providers)
	* [OpenAI](#OpenAI)
	* [Anthropic (Claude)](#Anthropic-(Claude))
	* [Huggingface](#Huggingface)
	* [Google generative language (PaLM API)](#Google-generative-language-(PaLM-API))
	* [LLaMA.cpp](#LLaMA.cpp)
* [Features](#Features)
	* [Get Code](#Get-Code)
	* [Inbuilt Prompts](#Inbuilt-Prompts)
		* [Refactor selection](#Refactor-selection)
		* [Generate unit test](#Generate-unit-test)
		* [Complete](#Complete)
		* [Explain code](#Explain-code)
		* [Generate Documentation](#Generate-Documentation)
		* [Find problems](#Find-problems)
		* [Optimize selection](#Optimize-selection)
	* [Chat](#Chat)
		* [UI behavior](#UI-behavior)
		* [Invocation](#Invocation)
		* [Prompts behavior](#Prompts-behavior)
	* [Search Stack Overflow](#Search-Stack-Overflow)
	* [Run Custom CLIs from within editor](#Run-Custom-CLIs-from-within-editor)
* [Prompting](#Prompting)
	* [Prompting](#Prompting)
		* [Features](#Features)
		* [UI behavior](#UI-behavior)
	* [Inbuilt prompts](#Inbuilt-prompts)
* [Prompt files format](#Prompt-files-format)
	* [Sample prompt files in repo](#Sample-prompt-files-in-repo)
	* [Simple javascript (.js) prompt file](#Simple-javascript-(.js)-prompt-file)
	* [Complex javascript (.js) prompt file](#Complex-javascript-(.js)-prompt-file)
	* [Creating Command](#Creating-Command)
	* [Creating Variables](#Creating-Variables)
		* [Predefined System Variables](#Predefined-System-Variables)
	* [Creating Functions](#Creating-Functions)
		* [Predefined System Functions](#Predefined-System-Functions)
	* [Creating CLI Commands](#Creating-CLI-Commands)
* [Requirements and TODO](#Requirements-and-TODO)
* [License](#License)
* [Contributions](#Contributions)
* [Support](#Support)

# Introduction

Interact with GPT AI models as a power user.

- Supports multiple [AI providers](/aiproviders)

  - [OpenAI GPT3.5/4](https://platform.openai.com/docs/api-reference/introduction)
  - [Anthropic Claude 1/2](https://docs.anthropic.com/claude/reference/complete_post)
  - [HuggingFace Inference API](https://huggingface.co/docs/api-inference/detailed_parameters)
  - Google Generative Language API i.e [PaLM API](https://developers.generativeai.google/api/rest/generativelanguage)
  - All models supported by [LLaMA.cpp](https://github.com/ggerganov/llama.cpp/tree/master). Current list:
    - LLaMA 🦙
    - LLaMA 2 🦙🦙
    - Alpaca
    - GPT4All
    - Chinese LLaMA / Alpaca and Chinese LLaMA-2 / Alpaca-2
    - Vigogne (French)
    - Vicuna
    - Koala
    - OpenBuddy 🐶 (Multilingual)
    - Pygmalion 7B / Metharme 7B
    - WizardLM
    - Baichuan-7B and its derivations (such as baichuan-7b-sft)
    - Aquila-7B / AquilaChat-7B

- Rich prompt engineering support

  - Inbuilt pre-defined prompts providing large set of [features](/features)
    - Refactor selection
    - Generate unit test
    - Complete
    - Explain code
    - Generate Documentation
    - Find problems
    - Optimize selection
  - Openly available [prompt files](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts) that can be tweaked as needed.
  - Prompts can be enriched with custom or predefined functions that can be engineered and fine-tuned to meet specific user needs.
  - Prompts can be saved and used directly within VSCode
  - Modify request parameters for GPT APIs as needed
  - Post-process response via responseHandlers in prompts.

- [Flexible UI](/features)

  - Chat activity bar interface for request/response interaction
    - Load/save conversations from history
    - Export conversations to a file
    - Copy/Insert/Create new files out of GPT response.
  - Ask FlexiGPT via editor/command context (select and right-click)
  - Ask FlexiGPT via command palette control (ctrl/cmd + shift + p)

- Search Stack Overflow from within the editor

- Invoke pre-cooked custom CLI commands from within your editor


# Getting started

## Installation

Download from: [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=ppipada.flexigpt) and follow instructions.

OR

Steps:

1. Install Visual Studio Code 1.74.0 or later
2. Launch Visual Studio Code
3. From the command palette `Ctrl`-`Shift`-`P` (Windows, Linux) or `Cmd`-`Shift`-`P` (macOS), run `> Extensions: Install Extension`.
4. Choose the extension `FlexiGPT` by `ppipada`.
5. Restart Visual Studio Code after the installation

## Configuration

- To configure FlexiGPT, open Visual Studio Code's settings (File > Preferences > Settings or by using the `Ctrl`/`Cmd` + `,` keyboard shortcut) and search for `flexigpt`.
- Configure FlexiGPT level configuration
- Configure an [AI provider](/aiproviders)

### FlexiGPT level configuration

Options:

- flexigpt.promptFiles: A semicolon-separated list of paths to user-defined prompt configuration files. Prompt file configuration is detailed [here](/promptfiles).
- flexigpt.inBuiltPrompts: A semicolon-separated list of inbuilt prompt filenames to enable. For multiple names separate with ';'. 'flexigptbasic.js' will always be enabled. Inbuilt prompts can be found at [this path](https://github.com/ppipada/vscode-flexigpt/tree/main/media/prompts). Current values are: "flexigptbasic.js", "gobasic.js" and "gosql.js".
- flexigpt.defaultProvider: The provider to use if multiple providers are configured. Currently, supported values: "openai", "anthropic", "huggingface", "googlegl".

### Sample Full configuration

```json
// flexigpt basic configuration
"flexigpt.promptFiles": "/home/me/my_prompt_files/myprompts.js",
"flexigpt.inBuiltPrompts": "gobasic.js;gosql.js",
"flexigpt.defaultProvider": "openai",

// openai provider configuration
"flexigpt.openai.apiKey": "sk-mkey",
"flexigpt.openai.timeout": "120",
"flexigpt.openai.defaultCompletionModel": "gpt-3.5-turbo",
"flexigpt.openai.defaultChatCompletionModel": "gpt-3.5-turbo",
"flexigpt.openai.defaultOrigin": "https://api.openai.com",

// anthropic provider configuration
"flexigpt.anthropic.apiKey": "sk-mkey",
"flexigpt.anthropic.timeout": "120",
"flexigpt.anthropic.defaultCompletionModel": "claude-2",
"flexigpt.anthropic.defaultChatCompletionModel": "claude-2",
"flexigpt.anthropic.defaultOrigin": "https://api.anthropic.com",

// huggingface provider configuration
"flexigpt.huggingface.apiKey": "hf-mkey",
"flexigpt.huggingface.timeout": "120",
"flexigpt.huggingface.defaultCompletionModel": "bigcode/starcoderbase",
"flexigpt.huggingface.defaultChatCompletionModel": "microsoft/DialoGPT-large",
"flexigpt.huggingface.defaultOrigin": "https://api-inference.huggingface.co",

// googlegl provider configuration
"flexigpt.googlegl.apiKey": "gl-mkey",
"flexigpt.googlegl.timeout": "120",
"flexigpt.googlegl.defaultCompletionModel": "text-bison-001",
"flexigpt.googlegl.defaultChatCompletionModel": "chat-bison-001",
"flexigpt.googlegl.defaultOrigin": "https://generativelanguage.googleapis.com",

// llamacpp provider configuration
"flexigpt.llamacpp.apiKey": "",
"flexigpt.llamacpp.timeout": "120",
"flexigpt.llamacpp.defaultOrigin": "127.0.0.1:8080",

```


# AI Providers

## OpenAI

- OpenAI provider requires an API key to function. You can obtain one from your openAI account settings [here](https://beta.openai.com/account/api-keys).

- Supported [APIs](https://platform.openai.com/docs/api-reference)

  - https://api.openai.com/v1/chat/completions
  - https://api.openai.com/v1/completions

- Supported models - All models supported by above two APIs

  - `gpt-4`
  - `gpt-4-*`
  - `gpt-3.5-turbo`
  - `gpt-3.5-turbo-*`

- FlexiGPT uses defaultChatCompletionModel: `gpt-3.5-turbo`, unless the prompt overrides it.

- For an example on how to use `Function calling` feature of OpenAI look at this prompt file [here](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gobasic.js).

- Configuration Options:

  - flexigpt.openai.apiKey: Your OpenAI API key.
  - flexigpt.openai.timeout: The timeout for OpenAI requests, in seconds. Default: 120.
  - flexigpt.openai.defaultChatCompletionModel: Default model to use for chat completion requests.
    - You can always override the default model per prompt via the prompt file command declaration.
    - FlexiGPT basic prompts will use the default models set.
    - Default: `gpt-3.5-turbo`. Note that `gpt-3.5-turbo` usage is accounted in OpenAIs billing. Only free model that is in beta as of Feb 2023 is codex (`code-davinci-002`).
  - flexigpt.openai.defaultCompletionModel: Default model to use for completion requests.
  - flexigpt.openai.defaultOrigin: Default origin to use for requests. This can be used to talk to any server that serves a compatible API.
    - Default: `https://api.openai.com`.

## Anthropic (Claude)

- Anthropic provider requires an API key to function. You can obtain one from the Anthropic website [here](https://docs.anthropic.com/claude/docs/getting-access-to-claude).

- Supported [API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

  - https://api.anthropic.com/v1/complete

- Supported models - All models supported by above API

  - `claude-2`
  - `claude-instant-1`

- FlexiGPT uses defaultChatCompletionModel: `claude-2`, unless the prompt overrides it.

- Configuration Options:

  - flexigpt.anthropic.apiKey: Your Anthropic API key.
  - flexigpt.anthropic.timeout: The timeout for Anthropic requests, in seconds. Default: 120.
  - flexigpt.anthropic.defaultChatCompletionModel: Default model to use for chat completion requests.
    - You can always override the default model per prompt via the prompt file command declaration.
    - FlexiGPT basic prompts will use the default models set.
    - Default: `claude-2`.
  - flexigpt.anthropic.defaultCompletionModel: Default model to use for completion requests.
  - flexigpt.anthropic.defaultOrigin: Default origin to use for requests. This can be used to talk to any server that serves a compatible API.
    - Default: `https://api.anthropic.com`.

## Huggingface

- Huggingface provider requires an API key to function. You can obtain one from the huggingface website [here](https://huggingface.co/settings/tokens).

- Supported [API](https://huggingface.co/docs/api-inference/quicktour)

  - https://api-inference.huggingface.co/models/<MODEL_ID>

- Supported models - All models supported by above API

- FlexiGPT uses defaultChatCompletionModel: `DialoGPT-large`, unless the prompt overrides it.

- Configuration Options:

  - flexigpt.huggingface.apiKey: Your Huggingface API key.
  - flexigpt.huggingface.timeout: The timeout for huggingface requests, in seconds. Default: 120.
  - flexigpt.huggingface.defaultChatCompletionModel: Default model to use for chat completion requests.
    - You can always override the default model per prompt via the prompt file command declaration.
    - FlexiGPT basic prompts will use the default models set.
    - Default: `microsoft/DialoGPT-large`.
  - flexigpt.huggingface.defaultCompletionModel: Default model to use for completion requests.
    - Default: `bigcode/starcoderbase`.
  - flexigpt.huggingface.defaultOrigin: Default origin to use for requests. This can be used to talk to any server that serves a compatible API.
    - Default: `https://api-inference.huggingface.co`.

## Google generative language (PaLM API)

- Googlegl provider requires an API key to function. You can obtain one from the website [here](https://developers.generativeai.google/tutorials/setup).

- Supported [APIs](https://developers.generativeai.google/api/rest/generativelanguage)

  - https://generativelanguage.googleapis.com/v1beta2/{model=models/*}:generateMessage
  - https://generativelanguage.googleapis.com/v1beta2/{model=models/*}:generateText

- Supported models - All models supported by above APIs

  - `chat-bison-001`
  - `text-bison-001`

- FlexiGPT uses defaultChatCompletionModel: `chat-bison-001`, unless the prompt overrides it.

- Configuration Options:

  - flexigpt.googlegl.apiKey: Your API key.
  - flexigpt.googlegl.timeout: The timeout for requests, in seconds. Default: 120.
  - flexigpt.googlegl.defaultChatCompletionModel: Default model to use for chat completion requests.
    - You can always override the default model per prompt via the prompt file command declaration.
    - FlexiGPT basic prompts will use the default models set.
    - Default: `chat-bison-001`.
  - flexigpt.googlegl.defaultCompletionModel: Default model to use for completion requests.
    - Default: `text-bison-001`.
  - flexigpt.googlegl.defaultOrigin: Default origin to use for requests. This can be used to talk to any server that serves a compatible API.
    - Default: `https://generativelanguage.googleapis.com`.

## LLaMA.cpp

- Setup a llama.cpp server as noted [here](https://github.com/ggerganov/llama.cpp/tree/master/examples/server)
  - If you are running a python openai compatible server as described [here](https://github.com/ggerganov/llama.cpp/tree/master/examples/server#api-like-oai), you can use the openai provider with modified default origin for talking to llama.cpp too.
  - This provider directly talkes to the default llama server built.

- Supported [APIs](https://github.com/ggerganov/llama.cpp/tree/master/examples/server#api-endpoints)

  - https://`your host:port of the llama server`/completion

- Supported models - All models supported by the above APIs. Note that the model in llama.cpp needs to be given when running the server itself and cannot be given at each request level.

- Configuration Options:

  - flexigpt.llamacpp.apiKey: Your API key.
  - flexigpt.llamacpp.timeout: The timeout for requests, in seconds. Default: 120.
  - flexigpt.llamacpp.defaultOrigin: Default origin to use for requests. This can be used to talk to any server that serves a compatible API.
    - Default: `http://127.0.0.1:8080`.


# Features

## Get Code

Get code using a comment in the editor.

- Write a comment asking for a specific code/functionality (Keep your cursor at the end of the same comment line)
- Press `Ctrl` + `Alt` + `G`
  - Also available via select text/code and right-click as `FlexiGPT: Get Code` option to click/enter
- Get code output below your cursor

## Inbuilt Prompts

Steps to get all the below functionality (similar for all configured prompts; inbuilt or custom):

- Select your code in the editor
- Invoke via `Ctrl` + `Alt` + `A`
  - Any other mechanism from [below](#invocation) is also ok
- Click on the respective prompt text

### Refactor selection

Rectify and refactor selected code.

### Generate unit test

Create unit test for selected code.

### Complete

Complete the selection.

### Explain code

Explain the selection.

### Generate Documentation

Generate documentation for the selected code.

### Find problems

Find problems with the selection, fix them and explain what was wrong.

### Optimize selection

Optimize the selected code

## Chat

### UI behavior

- Chat activity bar interface for request/response interaction
- Load/save conversations from history
- Export conversations to a file
- Copy/Insert/Create new files out of GPT response.
- Detailed request and response to/from to GPT APIs available in activity bar itself for better prompt engineering and debugging
- Your prompt history is available at the top of the activity bar.

### Invocation

The chat activity bar can be opened in following ways:

1. Click the FlexiGPT icon in the activity bar
2. Select text/code and right-click i.e editor context: You should get a `FlexiGPT: Ask` option to click/enter
3. Command Palette (`Ctrl`/`Cmd` + `Shift` + `P`): You should get a `FlexiGPT: Ask` option to click/enter
4. Keyboard shortcut: `Ctrl` + `Alt` + `A`

### Prompts behavior

- Click the input text box to load default and configured inbuilt/custom prompts.
- Full behavior and documentation can be found [here](/prompts).

## Search Stack Overflow

Search for stack overflow questions from your editor.

- Press `Ctrl` + `Alt` + `S`
  - Also available via select text/code and right-click as `FlexiGPT: Stackoverflow Search` option to click/enter
  - Also available via command Palette (`Ctrl`/`Cmd` + `Shift` + `P`): You should get a `FlexiGPT: Stackoverflow Search` option to click/enter
- An input box opens with your current line or selection autofilled. You can modify it or use it as is.
- Enter and get search results.
- Click on result to open stack overflow page.

## Run Custom CLIs from within editor

- Define your custom CLIs as `cliCommands` in your prompt files.
  - Example can be found [here](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gobasic.js)
  - Full documentation of how to define the prompt is in the [prompt files format](/promptfiles#creating-cli-commands) documentation.
- Press `Ctrl` + `Alt` + `C`
  - Also available via right click in editor as `FlexiGPT: Run CLI Command` to click/enter
  - Also available via command Palette (`Ctrl`/`Cmd` + `Shift` + `P`): You should get a `FlexiGPT: Run CLI Command` option to click/enter
  - Also available via the chat interface invocation to click/enter
  - Note that CLI command runs do not become part of your conversation with AI, even if it appears in the chat interface.
- An options box opens with available CLIs.
- Click on a CLI to open chat bar with your request and get response.


# Prompting

## Prompting

### Features

- Engineer and fine tune prompts, save them and use them directly within VSCode.

- Supports request parameter modifications for GPT APIs

- [Predefined system variables](/promptfiles#predefined-system-variables) can be used to enhance your question.
  - E.g: you can use `{system.selection}` to pass on the selected text in the editor (code or otherwise).
  - Note that the `system.` prefix for a system variable is optional. Therefore, you can even use only `{selection}` to use the selected text, or `{language}` instead of `{system.language}` for language of your file.

- Supports post-processing response via responseHandlers in prompts. Multiple inbuilt [predefined responseHandlers](/promptfiles#predefined-system-functions) available. Also supports custom responseHandlers. Example can be found [here](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gosql.js).

- Function calling feature of GPT3.5/4 models is also supported. Example can be found in [this prompt file](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gobasic.js).

### UI behavior

- On clicking on the input text box, [basic prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/flexigptbasic.js) provided by FlexiGPT itself, any prompts defined in `flexigpt.promptFiles`, and any inbuilt prompts enabled using `flexigpt.inBuiltPrompts`, as defined in the configuration should be loaded. (If first time click on text box doesn't load some preconfigured prompts, try escaping options and clicking again. VSCode may take some time to load dynamic lists from files.)

- If you select the preconfigured prompts the question template defined in the prompt command will be used after substituting defined system/user variables. Other command options will also be taken from the definition itself.

- If you type a free floating question in the text box, the text itself will be used as prompt directly. You can use [predefined system variables](/promptfiles#predefined-system-variables) to enhance your free floating question too.

## Inbuilt prompts

- [FlexiGPT basic prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/flexigptbasic.js) (Default: enabled)

  - Refactor selection
  - Generate unit test
  - Complete
  - Explain code
  - Generate Documentation
  - Find problems
  - Optimize selection

- [Go basic prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gobasic.js) (Default: disabled, enable in configuration)

  - Write godoc string
  - Generate unit test

- [Go sqlx + squirrel prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gosql.js) (Default: disabled, enable in configuration)
  - Generate Create, Read, Update, Delete (CRUD) code for a table specified as a struct selection in the editor using sqlx for db operations and squirrel for query building.


# Prompt files format

## Sample prompt files in repo

- [FlexiGPT basic prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/flexigptbasic.js)
- [Go basic prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gobasic.js)
- [Go sqlx + squirrel prompts](https://github.com/ppipada/vscode-flexigpt/blob/main/media/prompts/gosql.js)

## Simple javascript (.js) prompt file

```js
module.exports = {
  namespace: "myprompts",
  commands: [
    {
      name: "Refactor",
      template: `Refactor following function.
            function:
            {system.selection}`,
    },
  ],
};
```

## Complex javascript (.js) prompt file

```js
module.exports = {
  namespace: "MyComplexPrompts",
  commands: [
    {
      name: "Create unit test.",
      template: `Create unit test in {user.unitTestFramework} framework for following function.
            code:
            {system.selection}`,
      responseHandler: {
        func: "writeFile",
        args: {
          filePath: "user.testFileName",
        },
      },
      requestparams: {
        model: "gpt-3.5-turbo",
        stop: ["##", "func Test", "package main", "func main"],
      },
    },
    {
      name: "Write godoc",
      template: `Write godoc for following functions.
            code:
            {system.selection}`,
      responseHandler: {
        func: "append",
        args: {
          position: "start",
        },
      },
      requestparams: {
        model: "code-davinci-002",
        stop: ["##", "func Test", "package main", "func main"],
      },
    },
  ],
  functions: [
    // you could also write your own responseHandler.
    // Note that it takes a single object as input.
    function myHandler({ system, user }) {
      console.table({ system });
      console.table({ user });
    },
  ],
  variables: [
    {
      name: "unitTestFramework",
      value: "testing",
    },
    {
      name: "testFileName",
      value: ({ baseFolder, fileName, fileExtension }) =>
        `${baseFolder}\\${fileName}_test${fileExtension}`,
    },
  ],
  cliCommands: [
    {
      name: "Go generate all",
      command: `go generate ./...`,
      description: "Run go generate in the workspace",
    },
  ],
};
```

## Creating Command

- name: Required

  - Name of command, can be whatever you want

- description: Optional

  - Description of command, can be whatever you want

- template: Required

  - prompt template to use for create GPT model requests (OpenAI, etc). You can use system or user defined variable in template. variables will replaced with proper value while preparing request
  - To use system variable add `{system.*variableName*}`, variableName can be one of [Predefined System Variables](#predefined-system-variables)
  - To use user variable add `{user.*variableName*}`, variableName must be in variables field in prompt file.

- requestparams: optional

  - This is an object of type `{ [key: string]: any }`.
  - requestparams["provider"]: For setting a provider from non defaultProvider config
  - Any params relevant to the GPT provider API can be overridden.
  - Valid params for OpenAI completion request can be found in this [API reference](https://platform.openai.com/docs/api-reference/completions).

- responseHandler: Optional

  - responseHandler is used to handle a response. By default, replace function is used. Handle function can be one of [Predefined System Function](#predefined-system-functions) or a User defined function.
  - You can set responseHandler in following ways:

    - Just function name. function run with default values

    ```js
    responseHandler: "replace";
    ```

    - With args function name to set function args

    ```js
    responseHandler: {
        func: 'replace',
        args: {
        textToReplace: 'user.answerModified'
        }
    }
    ```

## Creating Variables

Any of the `variables` items can be used in a command template. User-defined values must have the "user" prefix. For example, if "testFileName" is defined in variables, it can be used as "user.TestFileName" in the template file or passed to a function.

Variable values can be static or dynamic. For dynamic values, you should create a getter method. When calling the variable getter, system variables(see Predefined System Variables) and functions are passed as arguments, the first argument is a system variable and the second one is a function.

```js
module.exports = {
variables: [
    {
        //static
        name: "testingFramework",
        value: "xUnit"
    },
    {
        //dynamic
        name: "typeNameInResponse",
        value: ({ answer/*system variable*/ }, { extractTypeName/*user defined function*/ }) => extractTypeName({ code: answer })
    },
]
functions: [function extractTypeName({ code, system }) {/**/}],
commands: [
    {
        name: "Create DTO",
        template: `Create unit test with {user.testingFramework} for following class.
        class:
        {system.selection}`,
        responseHandler: {
            func: 'writeFile',
            args: {
                filePath: 'user.typeNameInResponse'/*usage for function arg*/
            }
        }
    }
]
}
```

### Predefined System Variables

| Variable Name           | Description                         |
| ----------------------- | ----------------------------------- |
| system.selection        | Selected text in editor             |
| system.question         | OpenAI question                     |
| system.answer           | OpenAI answer                       |
| system.language         | Programming language of active file |
| system.baseFolder       | Project base path                   |
| system.fileFolder       | Parent folder path of active file   |
| system.fileName         | Name of active file                 |
| system.filePath         | Full path of active file            |
| system.fileExtension    | Extension of active file            |
| system.commitAndTagList | Last 25 commits and associated tags |

Note that the `system.` prefix for a system variable is optional. Therefore, you can even use only `{selection}` to use the selected text, or `{language}` instead of `{system.language}` for language of your file.

## Creating Functions

- Write a simple javascript function which takes exactly one object as input.
- Add that function to the `functions` list.
- Use in response handler as needed

### Predefined System Functions

| Function Name | Description                                | params(default)                                   |
| ------------- | ------------------------------------------ | ------------------------------------------------- |
| append        | Append Text                                | textToAppend(system.answer),postion('end')        |
| replace       | Replace selected text                      | textToReplace(system.answer)                      |
| showWebView   | Show Webview                               | question(system.question),question(system.answer) |
| writeConsole  | Write text to console                      | content(system.answer)                            |
| writeFile     | Write text to file. Append if file exists. | filePath(),content(system.answer)                 |

- Replace

  - Replace text with selection. Take optional parameter `textToReplace` In default value equals to API answer.
  - Default Usage

    ```js
        ...
        commands: [
            {
                name: "Refactor",
                template: `Refactor following function.
                function:
                {system.selection}`
                responseHandler:'replace'
            },
        ],
    ```

  - Usage with params

    ```js
        ...
        commands: [
            {
                name: "Refactor",
                template: `Refactor following function.
                function:
                {system.selection}`
                responseHandler:{
                    func: 'replace',
                    args: {
                        textToReplace: 'user.answerModified'
                    }
                }
            },
        ],
        variables: [
            {
                name: "answerModified",
                value: ({answer})=>`/*\n${anwer}\n*/`
            },
        ],
    ```

- Append

  - Append text with selection. Take optional parameter `textToAppend` and `postion`. `postion` can be `start` or `end`
  - In default `textToAppend` equals to OpenAI `postion` is end of selection
  - Sample usage

    ```js
        ...
        commands: [
            {
                name: "Append",
                template: `Write jsdoc for following function.
                function:
                {system.selection}`
                responseHandler:{
                    func: 'append',
                    args: {
                        position: 'start'
                    }
                }
            },
        ],
    ```

## Creating CLI Commands

- name: Required

  - Name of the cli command, can be whatever you want

- description: Optional

  - Description of the cli command, can be whatever you want

- command: Required

  - The cli string that you want to execute.
  - Note that the directory in which the command is executed is the root directory of your workspace.
  - You can use system or user defined variable in the command. Variables will replaced with proper values while preparing request
  - To use system variable add `{system.*variableName*}`, variableName can be one of [Predefined System Variables](#predefined-system-variables)
  - To use user variable add `{user.*variableName*}`, variableName must be in variables field in prompt file.


# Requirements and TODO

<table>
  <tr>
    <td><strong>Functional areas</strong></td>
    <td><strong>Features and Implementations</strong></td>
    <td><strong>Status</strong></td>
  </tr>
  <tr>
    <td rowspan="2"><strong>Flexibility to talk to any AI</strong></td>
    <td>Integration with multiple AI providers through APIs.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Support parameter selection and handle different response structures.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td rowspan="6"><strong>Flexibility to use custom prompts</strong></td>
    <td>Support for prompt engineering that enables creating and modifying prompts via a standard structure.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Allow request parameter modification</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Allow adding custom response handlers to massage the response from AI.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Provide common predefined functions that can be used to enhance the prompts</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Provide extra prompt enhancements using custom functions. This should allow function definitions in the prompt structure and integrate the results into prompts.</td>
    <td>Short term</td>
  </tr>
  <tr>
    <td>Provide capability to evaluate different prompts, assign ELO ratings, choose and save the strongest</td>
    <td>Medium term</td>
  </tr>
  <tr>
    <td rowspan="3"><strong>Seamless UI integration</strong></td>
    <td>Design a flexible UI, a chat interface integrated into the VSCode activity bar.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>The UI must support saving, loading, and exporting of conversations.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Implement streaming typing in the UI, creating a feeling that the AI bot is typing itself.</td>
    <td>Long term</td>
  </tr>
  <tr>
    <td rowspan="4"><strong>Adhoc queries/tasks</strong></td>
    <td> Help the developer ask adhoc queries to AI where he can describe the questions or issues to it using the chat interface. This can be used to debug issues, understand behaviour, get hints on things to look out for, etc. The developer should be able to attach code or files to his questions.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td> Provide a way to define pre cooked CLI commands and fire them as needed. Interface to define CLI commands should be similar to prompts.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td> Provide a way to search queries on StackOverflow.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td> Provide a way to get results for queries from StackOverflow answers and corresponding AI answer.</td>
    <td> Long term </td>
  </tr>
  <tr>
    <td rowspan="5"><strong>Code completion and intelligence</strong></td>
    <td>Provide a way to generate code from a code comment</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Provide a way to complete, refactor, edit, or optimize code via the chat interface. Should allow selecting relevant code from editor as needed.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Implement a context management system integrated with the Language Server Protocol (LSP) that can be used to enrich AI interactions.</td>
    <td>Medium term</td>
  </tr>
  <tr>
    <td>Support generating code embeddings to understand the code context and integrate it into prompts.</td>
    <td>Medium term</td>
  </tr>
  <tr>
    <td>Develop an intelligent code completion feature that predicts next lines of code. It should integrate context (LSP or embeddings) into autocomplete prompts and handle autocomplete responses in the UI.</td>
    <td>Medium term</td>
  </tr>
  <tr>
    <td rowspan="5"><strong>Code review and intelligence</strong></td>
    <td>Provide a way to review via the chat interface. Should allow selecting relevant code from editor as needed</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Ability to fetch a Merge/Pull request from Github, Gitlab or other version providers, analyse them and provide review comments. Should provide flexibility to specify review areas and associated priority depending on usecase.</td>
    <td>Medium term</td>
  </tr>
  <tr>
    <td>Provide automated code reviews and recommendations. It should provide subtle indicators for code improvements and handle code review API responses in the UI.</td>
    <td>Long term</td>
  </tr>
  <tr>
    <td>Provide automated refactoring suggestions. This should handle refactoring API responses and display suggestions in the UI.</td>
    <td>Long term</td>
  </tr>
  <tr>
    <td>Provide automated security suggestions. This should be able to identify potential vulnerabilities being added or deviations from security best practices used in code.</td>
    <td>Long term</td>
  </tr>
  <tr>
    <td rowspan="2"><strong>Code documentation assistance</strong></td>
    <td>Generate documentation for the selected code using the chat interface. Should allow selecting relevant code from editor as needed.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td>Develop effective inline documentation assistance. It should automatically generate and update documentation based on the code and display it in the UI.</td>
    <td>Long term</td>
  </tr>
  <tr>
    <td rowspan="3"><strong>Code Understanding and Learning Support</strong></td>
    <td>Provide a way to explain code via the chat interface. Should allow selecting relevant code from editor as needed.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td> Develop/Integrate with an integrated knowledge graph to provide detailed explanations of Services, APIs, methods, algorithms, and concepts the developer is using or may want to use </td>
    <td> Long term </td>
  </tr>
  <tr>
    <td> Integrate graph search into prompts </td>
    <td> Long term </td>
  </tr>
  <tr>
    <td rowspan="2"><strong>Testing</strong></td>
    <td> Provide a way to generate unit tests via the chat interface. Should allow selecting relevant code from editor as needed. Should have ability to insert tests in new files or current file as needed.</td>
    <td>Done</td>
  </tr>
  <tr>
    <td> Provide a way to generate API and associated workflow tests via the chat interface. Should allow selecting relevant code/api definitions from editor as needed. Should have ability to insert tests in new files or current file as needed.</td>
    <td> Short term </td>
  </tr>
</table>


# License

FlexiGPT is a fully open source software licensed under the [MIT license](https://github.com/ppipada/vscode-flexigpt/blob/main/LICENSE).


# Contributions

Contributions are welcome! Feel free to submit a pull request on [GitHub](https://github.com/ppipada/vscode-flexigpt).


# Support

If you have any questions or problems, please open an issue on GitHub at the [issues](https://github.com/ppipada/vscode-flexigpt/issues) page.



