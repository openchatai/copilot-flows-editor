import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Ajv from "ajv";
import { formatCode } from "../utils/format-json";
import { CodeBlock } from "../components/CodeBlock";
import cn from "../utils/cn";
import { Link } from "react-router-dom";
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
});

const validate = ajv.compile({
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    opencopilot: {
      type: "string",
      pattern: "^\\d+\\.\\d+$",
    },
    info: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        version: {
          type: "string",
        },
      },
      required: ["title", "version"],
    },
    flows: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          requires_confirmation: {
            type: "boolean",
          },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stepId: {
                  type: "string",
                },
                operation: {
                  type: "string",
                },
                open_api_operation_id: {
                  type: "string",
                },
                parameters: {
                  type: "object",
                },
              },
              required: ["operation", "open_api_operation_id"],
            },
          },
          on_success: {
            type: "array",
            items: {
              type: "object",
              properties: {
                handler: {
                  type: "string",
                },
              },
            },
          },
          on_failure: {
            type: "array",
            items: {
              type: "object",
              properties: {
                handler: {
                  type: "string",
                },
              },
            },
          },
        },
        required: [
          "name",
          "description",
          "requires_confirmation",
          "steps",
          "on_success",
          "on_failure",
        ],
      },
    },
  },
  required: ["opencopilot", "info", "flows"],
});

const example = {
  opencopilot: "0.1",
  info: {
    title: "My OpenCopilot definition",
    version: "1.0.0",
  },
  flows: [
    {
      name: "user registration",
      description: "The needed API flow to register a user into the system",
      requires_confirmation: false,
      steps: [
        {
          stepId: "xxx",
          operation: "call",
          open_api_operation_id: "operationId1",
        },
        {
          stepId: "xxx",
          operation: "call",
          open_api_operation_id: "operationId2",
          parameters: {
            user_verification: "xx.response.some_key",
          },
        },
        {
          operation: "call",
          open_api_operation_id: "operationId3",
        },
      ],
      on_success: [
        {
          handler: "plotOutcomeJsFunction",
        },
      ],
      on_failure: [
        {
          handler: "plotOutcomeJsFunction",
        },
      ],
    },
  ],
};

export default function Validator() {
  const [json, setJson] = useState<string>(JSON.stringify(example));
  const [valid, setValid] = useState(false);
  const [barOpen, setBarOpen] = useState(false);
  function parse() {
    try {
      const parsed = JSON.parse(json);
      setValid(true);
      return parsed;
    } catch (e: unknown) {
      if (e instanceof SyntaxError) {
        console.log(e.message);
        setValid(false);
      }
    }
    return {};
  }
  async function _formatCode() {
    const formatted = await formatCode(json);
    setJson(formatted);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => validate(parse()), [json]);
  useEffect(() => {
    _formatCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen max-h-screen h-screen bg-white font-sans">
      <div className="flex flex-col w-full h-full">
        <header className="w-full sticky top-0 left-0 z-40 bg-white min-h-fit p-2 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="font-bold text-lg">
              <img
                src="/logo-opencopilot.png"
                className="w-9 aspect-square"
                alt="logo-dark"
              />
            </div>
            <div className="nav flex-1">
              <div className="flex items-center justify-end gap-4">
                <button className="btn" onClick={_formatCode}>Format</button>
                <Link className="a" to="/flow">Flow Editor</Link>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-start">
          <div className="flex flex-1 h-full min-h-full">
            <CodeBlock
              initialValue={json}
              onChange={(value) => {
                setJson(value);
              }}
            />
          </div>
          <div
            className="fixed h-24 bottom-0 inset-x-0 w-full z-50 transform transition-transform shadow"
            style={{
              transform: `translateY(${!barOpen ? "100%" : 0})`,
            }}
          >
            <div className="w-full relative h-full bg-white border-t border-gray-600">
              <button
                onClick={() => setBarOpen(!barOpen)}
                className="flex items-center gap-2 border-l-0 absolute top-0 border border-b-transparent border-inherit -translate-y-full left-0 bg-white rounded-t-lg px-4 py-1"
              >
                <ChevronDownIcon
                  className={cn(
                    "text-xl transition-transform",
                    barOpen ? "rotate-0" : "rotate-180"
                  )}
                />
                {validate.errors ? (
                  <span className="inline-block text-rose-500 text-xs">
                    ( {validate.errors?.length} )
                  </span>
                ) : (
                  ""
                )}
              </button>

              <div className="w-full h-full max-h-full overflow-auto">
                {validate.errors ? (
                  <ul className="p-4">
                    {validate.errors?.map((error) => {
                      return (
                        <li className="flex items-center text-sm gap-2">
                          <span className="font-semibold">
                            {error.instancePath}
                          </span>
                          <div className="font-mono">{error.message}</div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="bg-emerald-500 text-white text-lg text-center p-2 m-2">
                    <span>Your OpenCopilot flows definition is valid</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
