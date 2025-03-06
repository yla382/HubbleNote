import { selectedNoteAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { twMerge } from 'tailwind-merge';

export const MarkdownRenderView = ({ className, ...props }: ComponentProps<"div">) => {
    const selectedNote = useAtomValue(selectedNoteAtom)

    if (!selectedNote) return null

    return (
        <div className={twMerge("p-4 prose prose-invert", className)} {...props}>
            <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
        </div>
    )
}
