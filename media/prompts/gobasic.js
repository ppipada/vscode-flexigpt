let testcaseSeparatorSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    testCases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          code: {
            type: "string",
          },
        },
        required: ["name", "code"],
        additionalProperties: false,
      },
    },
  },
  required: ["testCases"],
  additionalProperties: false,
};

module.exports = {
  namespace: "GoBasic",
  commands: [
    {
      name: "Generate testcases",
      template: `
              Go language\n
              Generate one data point covering zero value and error expectation,
              one data point covering MAX value,
              one data point covering MIN value,
              one data point covering non-zero value, string max 32 bytes, for calling a function.\n
              These data points are to be used to write table driven tests using {user.unitTestFramework} go framework.\n
              code:\n
              {system.selection}\n`,
      description: "Generate test cases for the selected code",
      requestparams: {
        frequencyPenalty: 0.0,
        presencePenalty: 0.1,
        functions: [
          { name: "testcaseSeparator", parameters: testcaseSeparatorSchema },
        ],
        functionCall: { name: "testcaseSeparator" },
      },
    },
  ],
  functions: [{}],
  variables: [
    {
      name: "unitTestFramework",
      value: "testing",
    },
    {
      name: "start",
      value: "start",
    },
    {
      name: "end",
      value: "end",
    },
    {
      name: "testFileName",
      value: ({ fileFolder, fileName, fileExtension }) =>
        `${fileFolder}\\${fileName}_test${fileExtension}`,
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
