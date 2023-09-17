import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { json as jsonLang, jsonParseLinter } from "@codemirror/lang-json";
import { basicLight } from "@uiw/codemirror-themes-all";
import { linter } from "@codemirror/lint";
import { useRef } from "react";

export function CodeBlock({
  initialValue,
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
}) {
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);

  return (
    <CodeMirror
      ref={codeMirrorRef}
      height="100%"
      className="w-full h-full [&_.cm-lineNumbers]:!hidden [&_.cm-gutters]:px-1.5 text-base min-h-full min-w-full max-w-full max-h-full"
      value={initialValue}
      theme={basicLight}
      onChange={onChange}
      extensions={[
        jsonLang(),
        EditorView.lineWrapping,
        linter(jsonParseLinter(), {
          delay: 500,
        }),
        basicSetup({
          syntaxHighlighting: true,
          foldGutter: false,
          lineNumbers: false,
          tabSize: 2,
          indentOnInput: true,
          autocompletion: true,
          drawSelection: true,
          allowMultipleSelections: true,
          bracketMatching: true,
          closeBrackets: true,
          searchKeymap: true,
        }),
      ]}
    />
  );
}
