import { EditorView, basicSetup } from "@codemirror/basic-setup";
import { history } from '@codemirror/history';
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { saveNoteAtom, selectedNoteAtom } from "@renderer/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

export const useMarkdownEditor = () => {
    const selectedNote = useAtomValue(selectedNoteAtom);
    const saveNote = useSetAtom(saveNoteAtom);
    const editorRef = useRef<EditorView | null>(null);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    const [editorView, setEditorView] = useState<EditorView>()

    const handleAutoSaving = async (content: string) => {
        if (!selectedNote) return;
        // Save the note content to disk
        await saveNote(content);
    };

    console.log(selectedNote)

    // Initialize the editor view only once
    useEffect(() => {
        if (!editorContainerRef.current || !selectedNote) return;

        // Create the initial state for the editor view
        const startState = EditorState.create({
            doc: selectedNote.content,
            extensions: [
                basicSetup,
                history(),
                markdown(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const content = update.state.doc.toString();
                        handleAutoSaving(content);
                    }
                }),
            ],
        });

        // Initialize the EditorView
        const view = new EditorView({
            state: startState,
            parent: editorContainerRef.current,
        });

         // Store the view in the ref for later access
         editorRef.current = view;

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
            }
        };
    }, [selectedNote?.title]);

    // Returning the refs and helper functions
    return {
        editorRef,
        editorContainerRef,
        selectedNote,
        handleAutoSaving,
    };
};
