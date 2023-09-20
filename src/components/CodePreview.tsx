import { useCallback, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CodeIcon,
} from "@radix-ui/react-icons";
import Ajv from "ajv";
import { js } from "js-beautify";
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

export function CodePreview() {
  // this will preview the whole code for the flows.
  const {
    state: { flows },
  } = useController();
  const [code, $setCode] = useState("{}");
  const [codeExpanded, setCodeExpanded] = useState(false);
  const setCode = useCallback(() => {
    const $flows = flows.map((flow) => {
      return {
        name: flow.name,
        description: flow.description,
        requires_confirmation: true,
        steps: flow.steps.map((step) => {
          const $step = step.data;
          // TODO: add support for other operations
          // TODO: better error handling for missing operationId
          return {
            operation: "call",
            stepId: step.id,
            open_api_operation_id: $step.operationId,
            parameters: $step.parameters,
          };
        }),
      };
    });
    const _$code = js(
      JSON.stringify({
        opencopilot: "0.1",
        info: {
          title: "My OpenCopilot definition",
          version: "1.0.0",
        },
        flows: $flows,
      }),
      {
        indent_size: 1,
      }
    );
    $setCode(_$code);
  }, [flows]);

  const [barOpen, setBarOpen] = useState(false);
  return (
    <div
      className={cn(
        "absolute right-0 transition-transform min-h-full h-full font-sans w-full max-h-full max-w-md z-50",
        codeExpanded ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="absolute space-y-1 top-1/2 left-0 -translate-x-full">
        <button
          className="p-2 text-xl shadow-xl block bg-white rounded-l"
          onClick={() => setCodeExpanded((pre) => !pre)}
        >
          <ChevronRightIcon
            className={cn(
              "transition-transform duration-200",
              codeExpanded ? "rotate-0" : "rotate-180"
            )}
          />
        </button>
        <button
          data-hidden={!codeExpanded}
          className="p-2 data-[hidden=true]:hidden text-xl shadow-xl block bg-white rounded-l"
          onClick={() => {
            if (!codeExpanded) {
              setCodeExpanded(true);
            }
            setCode();
          }}
        >
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
      <CodeBlock initialValue={code} />
    </div>
  );
}
