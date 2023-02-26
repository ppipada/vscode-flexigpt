import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as lsp from 'vscode-languageclient';


const { execSync } = require('child_process');
const { join } = require('path');

import { createConnection } from "vscode-languageserver/node";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

import { SymbolInformation, SignatureHelp } from "vscode-languageserver-types";
import log from "../logger/log";

interface LanguageServerOptions {
  command?: string;
  args?: string[];
  path?: string;
}

// Define a map of language IDs to default server options
const defaultLanguageServerOptions: Record<string, LanguageServerOptions> = {
  python: { command: 'python', args: ['-m pyls']  },
  javascript: { command: 'javascript-typescript-langserver', args: ['--stdio'] },
  typescript: { command: 'typescript-language-server', args: ['--stdio'] },
  go: { command: 'gopls', args: ['-mode=stdio'] },
  rust: { command: 'rust-analyzer' },
  php: { command: 'intelephense', args: ['--stdio'] },
  ruby: { command: 'solargraph', args: ['stdio'] },
  java: { command: 'java-language-server', args: ['-Xmx1G', '-jar', '/path/to/jars/lsp/jdt-language-server.jar'] },
  csharp: { command: 'omnisharp', args: ['-lsp'] },
  css: { command: 'css-languageserver', args: ['--stdio'] },
  html: { command: 'html-languageserver', args: ['--stdio'] },
  json: { command: 'vscode-json-languageserver', args: ['--stdio'] },
  lua: { command: 'lua-language-server', args: ['--stdio'] },
  ocaml: { command: 'ocaml-language-server', args: ['--stdio'] },
  perl: { command: 'perl-language-server', args: ['--stdio'] },
  powershell: { command: 'powershell-editor-services', args: ['-Stdio'] },
  sql: { command: 'sql-language-server', args: ['--stdio'] },
  yaml: { command: 'yaml-language-server', args: ['--stdio'] },
  bash: { command: 'bash-language-server', args: ['start'] },
  dockerfile: { command: 'docker-langserver', args: ['--stdio'] },
  groovy: { command: 'groovy-language-server', args: ['--stdio'] },
  markdown: { path: join(execSync('npm root -g').toString().trim(), 'markdown-language-server', 'out', 'server.js') },
  r: { path: '/path/to/R/library/languageserver/bin/r-languageserver' },
  swift: { path: '/path/to/sourcekit-lsp/.build/release/sourcekit-lsp' },
};


async function findCommandPath(command: string): Promise<string> {
  const envPaths = (process.env.PATH || "").split(path.delimiter);
  for (const envPath of envPaths) {
    const fullPath = path.join(envPath, command);
    if (await fileExists(fullPath)) {
      return fullPath;
    }
  }
  throw new Error(`Could not find command '${command}'`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

// Create a function that generates the server options dynamically
function getServerOptions(languageID: string): ServerOptions {
  let srvopts: ServerOptions = {command: "default", args: []};
  const overrideOptions = vscode.workspace.getConfiguration('languageServerOverrides');
  const options = overrideOptions[languageID] || defaultLanguageServerOptions[languageID];

  if (!options) {
    throw new Error(`Language server options not defined for language ID '${languageID}'`);
  }

  if (options.path) {
    srvopts = {
      command: options.path,
    };
  }

  if (options.command) {
    const commandPath = execSync(`which ${options.command}`).toString().trim();
    srvopts = {
      command: commandPath,
      args: options.args || [],
    };
  }
  if (srvopts) {
    log.info(`Language server config; ${JSON.stringify(srvopts)}`);
    return srvopts;
  }

  throw new Error(`Invalid server options for language ID '${languageID}'`);
}

async function getlanguageClient(languageId: string): Promise<LanguageClient> {
  let serverOptions: ServerOptions;
  try {
    serverOptions = getServerOptions(languageId);
  } catch (e) {
    log.error(`Error getting language server options for ${languageId}: ${e}`);
    throw e;
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: languageId }],
    synchronize: {
      configurationSection: languageId,
      fileEvents: vscode.workspace.createFileSystemWatcher("**/.clientrc"),
    },
  };

  const client = new LanguageClient(
    languageId,
    languageId,
    serverOptions,
    clientOptions
  );

  await client.start();

  return client;
}

export async function getDefinitionsForSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor found");
    return;
  }

  const selection = editor.selection;
  const selectedText = editor.document.getText(selection);

  const languageId = editor.document.languageId;
  let client: LanguageClient;
  try {
    client = await getlanguageClient(languageId);
  } catch (e) {
    throw e;
  }
  const symbols: SymbolInformation[] | undefined = await client?.sendRequest(
    "textDocument/documentSymbol",
    { textDocument: { uri: editor.document.uri.toString() } }
  );

  const symbol = symbols?.find((s: any) => s.name === selectedText);

  if (!symbol) {
    vscode.window.showInformationMessage(
      `No symbol found for "${selectedText}"`
    );
    return;
  }

  const signatureHelp: SignatureHelp | undefined = await client?.sendRequest(
    "textDocument/signatureHelp",
    {
      textDocument: { uri: editor.document.uri.toString() },
      position: symbol.location.range.start,
    }
  );

  const functionArgs = signatureHelp?.signatures[0]?.parameters
    ?.map((param: any) => param.label)
    .join(", ");

  const functionReturnType = signatureHelp?.signatures[0]?.label
    .split(":")[1]
    .trim();

  return functionArgs;
}

export async function getAllArgumentDefinitions() {
  // Get the current editor and position
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return [];
  }
  const position = editor.selection.active;

  // Get the language ID for the current document
  const languageId = editor.document.languageId;
  let client = await getlanguageClient(languageId);

  // Send a "signatureHelp" request to the language server
  const signatureHelp = await client?.sendRequest<vscode.SignatureHelp>(
    "textDocument/signatureHelp",
    {
      textDocument: {
        uri: editor.document.uri.toString(),
      },
      position: position,
    }
  );

  // If the signature help is available, retrieve the argument definitions
  if (signatureHelp) {
    const activeParameterIndex = signatureHelp.activeParameter ?? 0;
    const signatureIndex = signatureHelp.activeSignature ?? 0;
    const signature = signatureHelp.signatures[signatureIndex];
    const parameter = signature.parameters[activeParameterIndex];
    return parameter.documentation;
  }

  return [];
}
