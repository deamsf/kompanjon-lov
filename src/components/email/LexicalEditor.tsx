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
  EditorState,
  ParagraphNode,
  $getSelection,
  COMMAND_PRIORITY_NORMAL,
  TextFormatType
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
  RemoveFormatting
} from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { $setBlocksType } from "@lexical/selection";
import { 
  $createHeadingNode, 
  HeadingNode, 
  HeadingTagType 
} from "@lexical/rich-text";
import { $patchStyleText } from "@lexical/selection";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { CodeNode } from "@lexical/code";
import { QuoteNode } from "@lexical/rich-text";

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

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    if (!editor) return;
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor, updateToolbar]);

  const insertLink = useCallback(() => {
    if (!editor) return;
    const url = prompt('Enter URL:');
    if (url) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    }
  }, [editor]);

  const createList = useCallback((type: 'bullet' | 'number') => {
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const listNode = type === 'bullet' ? 
          $createParagraphNode().append($createTextNode('• ')) :
          $createParagraphNode().append($createTextNode('1. '));
        $setBlocksType(selection, () => listNode);
      }
    });
  }, [editor]);

  const alignText = useCallback((alignment: 'left' | 'center' | 'right') => {
    if (!editor) return;
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
    if (!editor) return;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Clear each format type individually
        selection.formatText('bold', false);
        selection.formatText('italic', false);
        selection.formatText('underline', false);
      }
    });
  }, [editor]);

  return (
    <div className="flex items-center gap-1 p-1 border-b mb-2" onClick={(e) => e.stopPropagation()}>
      <Toggle
        pressed={isBold}
        onPressedChange={() => {
          editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        size="sm"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isItalic}
        onPressedChange={() => {
          editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        size="sm"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isUnderline}
        onPressedChange={() => {
          editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
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
    nodes: [
      ParagraphNode,
      ListItemNode,
      ListNode,
      LinkNode,
      HeadingNode,
      HorizontalRuleNode,
      CodeNode,
      QuoteNode
    ],
    editorState: initialValue ? () => {
      const root = $getRoot();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(initialValue));
      root.append(paragraph);
    } : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full border rounded-md">
        <ToolbarPlugin />
        <div className="max-h-[400px] overflow-y-auto">
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
        </div>
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
