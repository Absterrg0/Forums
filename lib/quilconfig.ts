// quillConfig.ts

import 'react-quill/dist/quill.snow.css'; // Import the Quill CSS

export const quillModules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link'],
        ['clean'] // Remove formatting button
    ],
};

export const quillFormats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'color', 'background', 'align', 'link'
];
