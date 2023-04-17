import React, { useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Box } from "@mui/material";

// Suggest one of these values any time a `[` is encountered
const COLUMN_NAMES = [
  "columnA",
  "columnB",
  "columnC",
  "DColumn",
  "EColumn",
  "FColumn",
];

interface ColumnEditorInputProps {
  onChange: (val: any) => void;
  defaultValue: string;
}

const ColumnEditorInput = (props: ColumnEditorInputProps) => {
  const { onChange, defaultValue } = props;
  const editorRef = useRef<any>(null);
  const [totalLines, setTotalLines] = useState(1);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    setTotalLines((defaultValue as string).split(/\r\n|\r|\n/).length);
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model: any, position: any) => {
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

  function handleEditorChange(value: any, e: any) {
    onChange(value);

    setTotalLines((value as string).split(/\r\n|\r|\n/).length);
  }

  return (
    <Editor
      options={{
        overviewRulerLanes: 0,
        lineNumbers: "off",
        glyphMargin: false,
        folding: false,
        // Undocumented see https://github.com/Microsoft/vscode/issues/30795#issuecomment-410998882
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        minimap: { enabled: false, autohide: true, showSlider: undefined },
        scrollbar: { vertical: "hidden" },
      }}
      height={(totalLines + 1) * 18}
      width="500px"
      defaultLanguage="sql"
      defaultValue={defaultValue}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
    />
  );
};

export default ColumnEditorInput;
