import { useMemo, useState } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Ajv from "ajv";
import { formatCode } from "./utils/format-json";
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
});

const validate = ajv.compile({
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    age: {
      type: "number",
      minimum: 0,
    },
    address: {
      type: "object",
      properties: {
        street: {
          type: "string",
          minLength: 1,
        },
        city: {
          type: "string",
          minLength: 1,
        },
        state: {
          type: "string",
          minLength: 1,
        },
      },
      required: ["city", "state"],
    },
    website: {
      type: "string",
      minLength: 1,
      pattern: "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$",
    },
  },
  required: ["name", "age", "address", "website"],
});

const example = {
  name: "Ahmad Hassan",
  age: 22,
  website: "https://falta.info",
  address: {
    city: "zagazig",
    state: "Sharqia",
  },
};

function App() {
  const [json, setJson] = useState<string>(JSON.stringify(example));
  const [valid, setValid] = useState(false);
  const [barOpen, setBarOpen] = useState(true);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isValid = useMemo(() => validate(parse()), [json]);

  return (
    <div className="min-h-screen max-h-screen h-screen bg-white font-sans">
      <div className="flex flex-col w-full h-full">
        <header className="w-full sticky top-0 left-0 z-40 bg-white h-14 flex items-center">
          <div className="container flex items-center justify-between px-4">
            <div className="font-bold text-lg">Parser</div>
            <div className="nav flex-1">
              <div className="flex items-center justify-end gap-5">
                <button
                  onClick={async () => {
                    setJson(await formatCode(json));
                  }}
                >
                  Format
                </button>
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
              transform: `translateY(${barOpen ? "100%" : 0})`,
            }}
          >
            <div className="w-full relative h-full bg-white border-t border-gray-600">
              <button
                onClick={() => setBarOpen(!barOpen)}
                className="flex items-center gap-2 border-l-0 absolute top-0 border border-b-transparent border-inherit -translate-y-full left-0 bg-white rounded-t-lg px-4 py-1"
              >
                <ChevronDownIcon
                  className={`text-xl transition-transform ${
                    barOpen ? "rotate-180" : "rotate-0"
                  }`}
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
                    <span>No Errors, all clear</span>
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

export default App;
