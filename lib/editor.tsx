import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = ({ editorState, onChange }: { editorState: EditorState; onChange: (state: EditorState) => void }) => {
    const handleKeyCommand = (command: string) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const onBoldClick = () => {
        onChange(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    };

    const onItalicClick = () => {
        onChange(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    };

    const onUnderlineClick = () => {
        onChange(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    };

    return (
        <div>
            <div>
                <button onClick={onBoldClick}>Bold</button>
                <button onClick={onItalicClick}>Italic</button>
                <button onClick={onUnderlineClick}>Underline</button>
            </div>
            <Editor
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={onChange}
            />
        </div>
    );
};

export default MyEditor;
