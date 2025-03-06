import { defaultKeymap } from '@codemirror/commands';
import { highlightActiveLineGutter, lineNumbers } from '@codemirror/gutter';
import { defaultHighlightStyle, HighlightStyle, tags } from '@codemirror/highlight';
import { history, historyKeymap } from '@codemirror/history';
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { indentOnInput } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { bracketMatching } from '@codemirror/matchbrackets';
import { EditorState } from "@codemirror/state";
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { saveNoteAtom, selectedNoteAtom } from "@renderer/store";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";


export const transparentTheme = EditorView.theme({
    '&': {
      backgroundColor: 'transparent !important',
      height: '100%'
    }
  })

const syntaxHighlighting = HighlightStyle.define([
    {
    tag: tags.heading1,
    fontSize: '1.6em',
    fontWeight: 'bold'
    },
    {
    tag: tags.heading2,
    fontSize: '1.4em',
    fontWeight: 'bold'
    },
    {
    tag: tags.heading3,
    fontSize: '1.2em',
    fontWeight: 'bold'
    }
])

export const useMarkdownEditor = () => {
    const selectedNote = useAtomValue(selectedNoteAtom);
    const saveNote = useSetAtom(saveNoteAtom);
    const editorRef = useRef<EditorView | null>(null);
    const editorContainerRef = useRef<HTMLDivElement | null>(null);
    
    const handleAutoSaving = async (content: string) => {
        if (!selectedNote) return;
        // Save the note content to disk
        await saveNote(content);
    };

    // Initialize the editor view only once
    useEffect(() => {
        if (!editorContainerRef.current || !selectedNote) return;

        // Create the initial state for the editor view
        const startState = EditorState.create({
            doc: selectedNote.content,
            extensions: [
                keymap.of([...defaultKeymap, ...historyKeymap]),
                history(),
                lineNumbers(),
                indentOnInput(),
                bracketMatching(),
                highlightActiveLineGutter(),
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                    addKeymap: true
                }),
                transparentTheme,
                defaultHighlightStyle.fallback,
                syntaxHighlighting,
                oneDark,
                EditorView.lineWrapping,
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const content = update.state.doc.toString();
                        handleAutoSaving(content);
                    }
                })
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
