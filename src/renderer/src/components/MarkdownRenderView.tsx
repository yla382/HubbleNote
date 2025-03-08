import { selectedNoteAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";

export const MarkdownRenderView = ({ className, ...props }: ComponentProps<"div">) => {
  const selectedNote = useAtomValue(selectedNoteAtom);

  if (!selectedNote) return null;

  return (
    <div
      className={twMerge("max-w-none p-4 prose prose-invert break-words select-text", className)}
      {...props}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {selectedNote.content}
      </ReactMarkdown>
    </div>
  );
};
