import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";

// Suggest one of these values any time a `[` is encountered
const COLUMN_NAMES = [
  "columnA",
  "columnB",
  "columnC",
  "DColumn",
  "EColumn",
  "FColumn",
];

const SqlInput = () => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model: any, position: any) => {
        console.log("provideCompletionItems", { model, position });
        // Get the text before the current position

        const textBeforeCursor = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        // If inside of `[]`, suggest column names
        const match = textBeforeCursor.match(/\[(\w*)$/);
        if (match) {
          return {
            suggestions: COLUMN_NAMES.filter((name) =>
              name.startsWith(match[1])
            ).map((name) => ({
              label: name,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: name,
            })),
          } as any;
        }

        return { suggestions: [] } as any;
      },
    });
  }

  function showValue() {
    console.log((editorRef.current as any).getValue());
  }

  return (
    <>
      <button onClick={showValue}>Show value</button>
      <Editor
        options={{
          lineNumbers: "off",
          glyphMargin: false,
          folding: false,
          // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          minimap: { enabled: false },
        }}
        height="200px"
        defaultLanguage="sql"
        defaultValue="-- Start writing SQL here"
        onMount={handleEditorDidMount}
      />
    </>
  );
};

export default SqlInput;
