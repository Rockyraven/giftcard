// src/components/TextEditor.tsx
// @ts-nocheck
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import React, { useState, useRef, useEffect } from "react";
import "@/styles/styles.scss";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import BulletList from "@tiptap/extension-bullet-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { ImageResize } from "./ImageResize";
import TextAlign from "@tiptap/extension-text-align";
import Loader from "./loaders/Loader";

const MenuBar = ({ editor, onSave }) => {
  if (!editor) {
    return null;
  }
  const activeHeadingLevel =
    [1, 2, 3, 4, 5, 6].find((level) => editor.isActive("heading", { level })) ||
    "Headings";

  const saveContent = () => {
    const rawContent = editor.getHTML();
    onSave(rawContent);
  };

  return (
    <div className="control-group py-4">
      <div className="button-group grid grid-cols-12">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${
            editor.isActive("bold") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${
            editor.isActive("italic") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${
            editor.isActive("strike") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Strike
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer p-2 bg-gray-100 rounded">
              Text Align
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              Left
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              Center
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              Right
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`${
            editor.isActive("code") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={`${
            editor.isActive("unsetAllMarks") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Clear marks
        </button>
        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className={`${
            editor.isActive("clearNodes") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`${
            editor.isActive("paragraph") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Paragraph
        </button>

        {/* Wrap heading buttons inside dropdown */}
        <DropdownMenu className="w-fit h-fit bg-blue-500">
          <DropdownMenuTrigger>
            <div className="cursor-pointer p-2 bg-gray-100 rounded">
              {typeof activeHeadingLevel === "number"
                ? `H${activeHeadingLevel}`
                : activeHeadingLevel}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                className={`${
                  editor.isActive("heading", { level })
                    ? "is-active bg-gray-200"
                    : ""
                } bg-gray-100`}
              >
                H{level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dropdown for List Options */}
        <DropdownMenu className="w-fit h-fit bg-blue-500">
          <DropdownMenuTrigger>
            <div className="cursor-pointer p-2 bg-gray-100 rounded">
              {/* show lists if no list is active otherwise show the active list */}
              {editor.isActive("bulletList")
                ? "Bullet list"
                : editor.isActive("orderedList")
                ? "Ordered list"
                : "List"}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              Bullet list
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              Ordered list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${
            editor.isActive("codeBlock") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${
            editor.isActive("blockquote") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`${
            editor.isActive("horizontalRule") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Horizontal rule
        </button>
        <button
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className={`${
            editor.isActive("hardBreak") ? "is-active bg-gray-200" : ""
          } bg-gray-100`}
        >
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`${
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active bg-gray-200"
              : ""
          } bg-gray-100`}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`${
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active bg-gray-200"
              : ""
          } bg-gray-100`}
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={`${
            editor.isActive("textStyle", { color: "#958DF1" })
              ? "is-active bg-gray-200"
              : ""
          } bg-gray-100`}
        >
          Purple
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer p-2 bg-gray-100 rounded">
              Table Operations
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              Insert table
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Add column before
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
            >
              Add column after
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
            >
              Delete column
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowBefore().run()}
            >
              Add row before
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
            >
              Add row after
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteRow().run()}
            >
              Delete row
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteTable().run()}
            >
              Delete table
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().mergeCells().run()}
            >
              Merge cells
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().splitCell().run()}
            >
              Split cell
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            >
              Toggle header column
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              Toggle header row
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            >
              Toggle header cell
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().mergeOrSplit().run()}
            >
              Merge or split
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().setCellAttribute("colspan", 2).run()
              }
            >
              Set cell attribute
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().fixTables().run()}
            >
              Fix tables
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().goToNextCell().run()}
            >
              Go to next cell
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
            >
              Go to previous cell
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer p-2 bg-gray-100 rounded">
              Image Operations
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setImage({ src: "https://placehold.co/800x400" })
                  .run()
              }
            >
              Insert image
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: "https://placehold.co/800x400/6A00F5/white",
                  })
                  .run()
              }
            >
              Insert image with custom style
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: "https://placehold.co/800x400",
                    align: "left",
                  })
                  .run()
              }
            >
              Align left
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: "https://placehold.co/800x400",
                    align: "right",
                  })
                  .run()
              }
            >
              Align right
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: "https://placehold.co/800x400",
                    align: "center",
                  })
                  .run()
              }
            >
              Align center
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={saveContent} className="bg-gray-100 p-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "my-custom-class",
      },
    },
  }),
  Table,
  TableCell,
  TableHeader,
  TableRow,
  ImageResize.configure({
    inline: true,
    allowBase64: true,
  }),
  TextAlign.configure({
    types: [
      "heading",
      "paragraph",
      "listItem",
      "tableCell",
      "tableHeader",
      "tableRow",
      "table",
      "codeBlock",
      "blockquote",
      "horizontalRule",
      "hardBreak",
      "code",
      "textStyle",
      "image",
    ],
  }),
];

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>

<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
<p>You can also insert images with custom styles.</p>

`;

const TextEditor = () => {
  const [savedContent, setSavedContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFirstUpload, setIsFirstUpload] = useState(true);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "editor",
      },
    },
  });

  const handleSave = async (content) => {
    try {
      const response = await fetch("/api/save-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Content saved successfully:", result);
        setSavedContent(content);
      } else {
        console.error("Failed to save content:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleFileDrop = async (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    console.log("File being uploaded:", file);

    if (isFirstUpload) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "https://rich-text-backend.onrender.com/api/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Upload response:", data);
          const url = data.url;

          console.log("Editor:", editor);

          if (editor) {
            editor
              .chain()
              .focus()
              .setImage({
                src: url,
                alt: file.name,
                width: 640,
                height: "auto",
              })
              .run();
            console.log("Image inserted into editor");
          } else {
            console.error("Editor is null");
          }
        } else {
          console.error("Failed to upload image:", response.statusText);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
        setIsFirstUpload(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const localImageUrl = e.target.result;
        if (editor) {
          editor
            .chain()
            .focus()
            .setImage({
              src: localImageUrl,
              alt: file.name,
              width: 640,
              height: "auto",
            })
            .run();
          console.log("Image inserted into editor");
        } else {
          console.error("Editor is null");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      handleFileDrop({ dataTransfer });
    }
  };

  const handleInsertInputBox = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent('<input type="text" placeholder="Enter text here" />')
        .run();
    }
  };

  useEffect(() => {
    const buttons = document.querySelectorAll(".insert-input-button");
    buttons.forEach((button) => {
      button.addEventListener("click", handleInsertInputBox);
    });
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleInsertInputBox);
      });
    };
  }, [editor]);

  return (
    <div className="w-fit h-fit flex mx-auto flex-col focus:outline-none">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <div
        className="editor-container relative"
        onDrop={handleFileDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <MenuBar editor={editor} onSave={handleSave} />
        <EditorContent editor={editor} className="editor" />
        <button className="insert-input-button" onClick={handleInsertInputBox}>
          Add
        </button>
        {isUploading && (
          <div
            role="status"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Loader />
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
      {savedContent && (
        <div className="mt-4">
          <h3>Saved Content:</h3>
          <div dangerouslySetInnerHTML={{ __html: savedContent }} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
