import { selectedNoteAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";

// CopyButton Component
const CopyButton = ({ code }: { code: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied!"); // Optionally show a notification
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute bottom-2 right-0 bg-gray-700 text-white p-1 rounded-md text-sm"
    >
      Copy
    </button>
  );
};

// MarkdownRenderView Component
export const MarkdownRenderView = ({ className, ...props }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);

  if (!selectedNote) return null;

  // Define the code renderer to show the CopyButton only for code blocks (triple backticks)
  const renderers = {
    code({ inline, className = "", children, ...props }) {
      const codeString = String(children).replace(/\n$/, "");

      // If the className contains "language-", it's a block of code (triple backticks)
      const isBlockCode = className && className.includes("language-");

      if (inline || !isBlockCode) {
        // Inline code (single backticks), render normally without the Copy button
        return (
          <code className={`inline-block bg-transparent rounded-sm px-1 text-sm`} {...props}>
            {codeString}
          </code>
        );
      }

      // For code blocks (triple backticks), we add the CopyButton and style the block
      return (
        <div className="relative">
          <CopyButton code={codeString} />
          <pre className={`m-1 bg-transparent p-0 rounded-md my-4 ${className}`} {...props}>
            <code className="text-white">{codeString}</code>
          </pre>
        </div>
      );
    },
  };

  return (
    <div
      className={twMerge("max-w-none p-4 prose prose-invert break-words select-text", className)}
      {...props}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={renderers} // Add the custom code block renderer
      >
        {selectedNote.content}
      </ReactMarkdown>
    </div>
  );
};
