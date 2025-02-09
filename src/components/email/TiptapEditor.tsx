
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Toggle } from "@/components/ui/toggle";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  List, 
  ListOrdered,
  RemoveFormatting,
  Code,
  Type
} from "lucide-react";
import { useState } from 'react';

interface TiptapEditorProps {
  onChange: (html: string) => void;
  initialValue?: string;
}

const TiptapEditor = ({ onChange, initialValue }: TiptapEditorProps) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline',
        },
      }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  if (!editor) {
    return null;
  }

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const clearFormatting = () => {
    editor
      .chain()
      .focus()
      .clearNodes()
      .unsetAllMarks()
      .run();
  };

  const toggleMarkdownMode = () => {
    setIsMarkdownMode(!isMarkdownMode);
    // In a real implementation, you would handle markdown conversion here
  };

  return (
    <div className="w-full border rounded-md">
      <div className="flex items-center gap-1 p-1 border-b mb-2">
        <Toggle
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          size="sm"
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive('link')}
          onPressedChange={insertLink}
          size="sm"
          aria-label="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-4 bg-border mx-1" />
        <Toggle
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          aria-label="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <div className="w-px h-4 bg-border mx-1" />
        <Toggle
          pressed={false}
          onPressedChange={clearFormatting}
          size="sm"
          aria-label="Clear Formatting"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Toggle>
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
      <div className="min-h-[200px] max-h-[400px] overflow-y-auto prose prose-sm max-w-none">
        <EditorContent 
          editor={editor} 
          className="outline-none p-2 min-h-[200px]"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
