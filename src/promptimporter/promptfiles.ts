import * as vscode from "vscode";
import axios from "axios";
import log from "../logger/log";

import { fileExists, isHttpAddress } from "./promptutils";
import { FunctionWrapper } from "./promptfunctions";
import { Variable } from "./promptvariables";
import {
  Command,
  CommandRunnerContext,
  DEFAULT_RESPONSE_HANDLER,
} from "./promptcommands";

export class FilesImporter {
  commandRunnerContext: CommandRunnerContext;
  
  constructor(commandRunnerContext: CommandRunnerContext) {
    this.commandRunnerContext = commandRunnerContext;
  }

  read(fileOrUrl: string) {
    let dataRead = "";
    return new Promise((resolve, reject) => {
      if (isHttpAddress(fileOrUrl)) {
        axios
          .get(fileOrUrl)
          .then((response) => {
            dataRead = response.data;
            resolve(dataRead);
          })
          .catch((error) => {
            log.error(`Error in read: ${error}`);
            reject(error);
          });
      } else {
        vscode.workspace.fs
          .readFile(vscode.Uri.file(fileOrUrl))
          .then((buffer) => {
            dataRead = buffer.toString();
            resolve(dataRead);
          })
          .then(undefined, (err) => {
            log.error(`Error in read: ${err}`);
            reject(err);
          });
      }
    });
  }

  processFileContents(userDefinitions: any) {
    if (userDefinitions?.commands) {
      userDefinitions.commands.forEach(
        (command: {
          name: any;
          template: any;
          responseHandler: any;
          description: any;
          requestparams: any;
        }) => {
          let addc = new Command(
            command.name,
            command.template,
            command.responseHandler,
            command.description
          );
          if (command.description as string) {
            addc.description = command.description;
          } else {
            addc.description = command.name;
          }
          if (command.responseHandler) {
            addc.responseHandler = command.responseHandler;
          } else {
            addc.responseHandler = DEFAULT_RESPONSE_HANDLER;
          }
          if (command.requestparams as { [key: string]: any }) {
            addc.requestparams = command.requestparams;
          }
          this.commandRunnerContext.addCommand(addc);
        }
      );
    }
    if (userDefinitions?.variables) {
      userDefinitions.variables.forEach(
        (variable: { name: any; value: any }) => {
          this.commandRunnerContext.setUserVariable(
            new Variable(variable.name, variable.value)
          );
        }
      );
    }

    if (userDefinitions?.functions) {
      userDefinitions.functions.forEach((fn: Function) => {
        this.commandRunnerContext.setFunction(FunctionWrapper.fromFunction(fn));
      });
    }
  }

  importJsPromptFile(promptFile: string) {
    this.read(promptFile)
      .then((data) => {
        let c = data as string;
        let userDefinitions = eval(c);
        this.processFileContents(userDefinitions);
      })
      .then(undefined, (err) => {
        log.error(`Error in readfile ${err}`);
      })
      .catch((error) => {
        log.error(`Caught error in readFile ${error}`);
      });
  }

  importJsonPromptFile(promptFile: string) {
    this.read(promptFile)
      .then((data) => {
        let c = data as string;
        let userDefinitions = JSON.parse(c);
        this.processFileContents(userDefinitions);
        // log.info(data);
      })
      .then(undefined, (err) => {
        log.error(`Error in readfile ${err}`);
      })
      .catch((error) => {
        log.error(`Caught error in readFile ${error}`);
      });
  }

  getFileType(promptFile: string): string | undefined {
    if (promptFile) {
      return promptFile.split(".")?.pop()?.toLowerCase();
    }
  }

  importFile(filePath: string) {
    if (filePath === "") {
      log.info("Empty file prompt. skipping.");
      return;
    }
    fileExists(filePath)
      .then((data) => {
        if (!data) {
          log.info(`Couldn't find file "${filePath}". Skipping import`);
        } else {
          const fileType = this.getFileType(filePath);
          if (fileType === "js") {
            this.importJsPromptFile(filePath);
          } else if (fileType === "json") {
            this.importJsonPromptFile(filePath);
          }
        }
      })
      .catch((error) => {
        log.error(error);
      });
  }

  splitPromptFiles(promptFiles: string): Array<string> {
    if (!promptFiles) {
      return [];
    }
    return promptFiles.split(";");
  }

  public importPromptFiles(promptFiles: string) {
    const allPromptFiles = this.splitPromptFiles(promptFiles);

    log.info(allPromptFiles);
    allPromptFiles.forEach((sf) => {
      try {
        this.importFile(sf);
      } catch (error) {
        log.error(error);
        return;
      }
    });
  }
}
