import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export const MarkdownEditor = ({ className, ...props }: ComponentProps<'div'>) => {
    const { editorContainerRef, selectedNote } = useMarkdownEditor();

    if (!selectedNote) return null;

    return (
        <div
            ref={editorContainerRef}
            className={twMerge("outline-none h-full min-h-screen max-w-none text-lg px-4 pt-2 pb-8 caret-yellow-500 prose prose-invert", className)}
            {...props}
        />
    );
};