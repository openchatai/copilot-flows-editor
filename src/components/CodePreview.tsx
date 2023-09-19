import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, CodeIcon } from "@radix-ui/react-icons";
import Ajv from "ajv";
import { formatCode } from "../utils/format-json";
import { CodeBlock } from "../components/CodeBlock";
import cn from "../utils/cn";
import { useController } from "./stores/Controller";
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

export function CodePreview() {
  // this will preview the whole code for the flows.
  const [json, setJson] = useState<string>(JSON.stringify(example));
  const [valid, setValid] = useState(false);
  const [barOpen, setBarOpen] = useState(false);
  const {
    state: { codeExpanded },
    toggleCodeExpanded,
  } = useController();
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
    <div
      className={cn(
        "absolute right-0 transition-transform min-h-full h-full font-sans w-full max-w-md z-50",
        codeExpanded ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="absolute top-1/2 left-0 -translate-x-full bg-white rounded-l">
        <button className="p-2 text-xl shadow-xl" onClick={toggleCodeExpanded}>
          <CodeIcon />
        </button>
      </div>
      <div
        className="absolute h-24 bottom-0 inset-x-0 w-full z-50 transform transition-transform shadow"
        style={{
          transform: `translateY(${!barOpen ? "100%" : 0})`,
        }}
      >
        <div className="w-full relative h-full bg-white border-t border-stone-500">
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
      <CodeBlock
        initialValue={json}
        onChange={(value) => {
          setJson(value);
        }}
      />
    </div>
  );
}
