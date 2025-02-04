import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $createParagraphNode, $createTextNode, EditorState } from 'lexical';

const theme = {
  paragraph: 'mb-1',
  text: {
    base: 'text-foreground',
  },
};

const onError = (error: Error) => {
  console.error(error);
};

interface LexicalEditorProps {
  onChange: (html: string) => void;
  initialValue?: string;
}

export default function LexicalEditor({ onChange, initialValue }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'EmailEditor',
    theme,
    onError,
    editorState: initialValue ? () => {
      const root = $getRoot();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(initialValue));
      root.append(paragraph);
    } : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full min-h-[200px] border rounded-md">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable 
              className="min-h-[200px] outline-none p-2"
            />
          }
          placeholder={
            <div className="absolute top-2 left-2 text-muted-foreground pointer-events-none">
              Start typing...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              const root = $getRoot();
              const text = root.getTextContent();
              onChange(text);
            });
          }}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}