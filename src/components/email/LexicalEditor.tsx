import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { 
  $getRoot, 
  $createParagraphNode, 
  $createTextNode, 
  $getSelection,
  EditorState,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $isRangeSelection
} from 'lexical';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  FileText
} from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $patchStyleText } from "@lexical/selection";
import { ListItemNode, ListNode, $createListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";

const theme = {
  paragraph: 'mb-1',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  list: {
    ul: 'list-disc ml-4',
    ol: 'list-decimal ml-4',
  },
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'link');
    }
  }, [editor]);

  const createList = useCallback((type: 'bullet' | 'number') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === 'bullet') {
          $setBlocksType(selection, () => $createListNode('bullet'));
        } else {
          $setBlocksType(selection, () => $createListNode('number'));
        }
      }
    });
  }, [editor]);

  const alignText = useCallback((alignment: 'left' | 'center' | 'right') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          textAlign: alignment,
        });
      }
    });
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText('');
      }
    });
  }, [editor]);

  return (
    <div className="flex items-center gap-1 p-1 border-b mb-2">
      <Toggle
        pressed={isBold}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isItalic}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isUnderline}
        onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        size="sm"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isLink}
        onPressedChange={insertLink}
        size="sm"
      >
        <Link className="h-4 w-4" />
      </Toggle>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => createList('bullet')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => createList('number')}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => alignText('left')}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => alignText('center')}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => alignText('right')}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFormatting}
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Toggle
        pressed={isMarkdownMode}
        onPressedChange={setIsMarkdownMode}
        size="sm"
      >
        <FileText className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

interface LexicalEditorProps {
  onChange: (html: string) => void;
  initialValue?: string;
}

export default function LexicalEditor({ onChange, initialValue }: LexicalEditorProps) {
  const initialConfig = {
    namespace: 'EmailEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [ListItemNode, ListNode, LinkNode],
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
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="min-h-[200px] outline-none p-2"
            />
          }
          placeholder={
            <div className="absolute top-12 left-2 text-muted-foreground pointer-events-none">
              Start typing...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              const root = $getRoot();
              const html = root.getTextContent();
              onChange(html);
            });
          }}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}