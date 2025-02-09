
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
  $getSelection,
  COMMAND_PRIORITY_NORMAL,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link as LinkIcon, 
  List, 
  ListOrdered,
  RemoveFormatting,
  Code,
  Type
} from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode } from "@lexical/link";
import { 
  ListItemNode, 
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from "@lexical/list";
import { $isListNode, $isListItemNode } from "@lexical/list";
import { $generateHtmlFromNodes } from '@lexical/html';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

const theme = {
  paragraph: 'mb-1',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  list: {
    ul: 'list-disc ml-4 mb-2',
    ol: 'list-decimal ml-4 mb-2',
    listitem: 'mb-1',
  },
  link: 'text-blue-500 hover:underline',
};

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [isList, setIsList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const nodes = selection.getNodes();
      const hasLink = nodes.some(node => $isLinkNode(node) || node.getParent()?.getParent()?.getType() === 'link');
      setIsLink(hasLink);

      const parent = nodes[0].getParent();
      const isList = $isListItemNode(parent);
      setIsList(isList && parent?.getParent()?.getType() === 'ul');
      setIsOrderedList(isList && parent?.getParent()?.getType() === 'ol');
    }
  }, []);

  useEffect(() => {
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
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  }, [editor]);

  const createList = useCallback((type: 'bullet' | 'number') => {
    if (!editor) return;
    if (type === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  }, [editor]);

  const clearFormatting = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        
        // Remove all formatting
        selection.insertText(selection.getTextContent());
        
        // Remove any links
        nodes.forEach(node => {
          if ($isLinkNode(node)) {
            node.remove();
          }
        });
      }
    });
  }, [editor]);

  const toggleMarkdownMode = useCallback(() => {
    setIsMarkdownMode(!isMarkdownMode);
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if (firstChild) {
        firstChild.markDirty();
      }
    });
  }, [editor, isMarkdownMode]);

  return (
    <div className="flex items-center gap-1 p-1 border-b mb-2" onClick={(e) => e.stopPropagation()}>
      <Toggle
        pressed={isBold}
        onPressedChange={() => {
          editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        size="sm"
        aria-label="Bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isItalic}
        onPressedChange={() => {
          editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        size="sm"
        aria-label="Italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isUnderline}
        onPressedChange={() => {
          editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        size="sm"
        aria-label="Underline"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isLink}
        onPressedChange={insertLink}
        size="sm"
        aria-label="Insert Link"
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <div className="w-px h-4 bg-border mx-1" />
      <Toggle
        pressed={isList}
        onPressedChange={() => createList('bullet')}
        size="sm"
        aria-label="Bullet List"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isOrderedList}
        onPressedChange={() => createList('number')}
        size="sm"
        aria-label="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <div className="w-px h-4 bg-border mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFormatting}
        className="px-2"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Button>
      <div className="w-px h-4 bg-border mx-1" />
      <Toggle
        pressed={isMarkdownMode}
        onPressedChange={toggleMarkdownMode}
        size="sm"
        aria-label="Toggle Markdown Mode"
      >
        {isMarkdownMode ? <Code className="h-4 w-4" /> : <Type className="h-4 w-4" />}
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
    nodes: [
      ListItemNode,
      ListNode,
      LinkNode,
      HorizontalRuleNode
    ],
    editorState: initialValue ? () => {
      const root = $getRoot();
      if (initialValue) {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(initialValue));
        root.append(paragraph);
      }
    } : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full border rounded-md">
        <ToolbarPlugin />
        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="outline-none p-2 min-h-[200px] prose prose-sm max-w-none"
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
              const [currentEditor] = useLexicalComposerContext();
              const html = $generateHtmlFromNodes(currentEditor);
              onChange(html);
            });
          }}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}
