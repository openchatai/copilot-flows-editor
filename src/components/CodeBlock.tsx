import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { basicSetup } from "@uiw/codemirror-extensions-basic-setup";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { json as jsonLang, jsonParseLinter } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-themes-all";
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
  const editor = codeMirrorRef.current;

  return (
    <CodeMirror
      ref={codeMirrorRef}
      height="100%"
      className="w-full h-full text-xl min-h-full min-w-full max-w-full max-h-full"
      value={initialValue}
      theme="dark"
      onChange={onChange}
      extensions={[
        basicSetup({
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          autocompletion: true,
          syntaxHighlighting: true,
          lineNumbers: true,
          lintKeymap: true,
          highlightActiveLineGutter: true,
        }),
        jsonLang(),
        EditorView.lineWrapping,
        githubLight,
        linter(jsonParseLinter(), {
          delay: 500,
        }),
      ]}
    />
  );
}
