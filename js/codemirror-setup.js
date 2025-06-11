import { pythonKeywords } from './python-keywords.js';

function setupCodeMirror() {
    const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: "python",
        theme: "material",
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        },
        hintOptions: {
            completeSingle: false
        }
    });

    editor.on("inputRead", function(cm, change) {
        if (change.text[0].match(/[\w\.]/)) {
            cm.showHint({hint: CodeMirror.hint.python});
        }
    });

    CodeMirror.registerHelper("hint", "python", function(cm) {
        const cursor = cm.getCursor();
        const token = cm.getTokenAt(cursor);
        const start = token.start;
        const end = cursor.ch;
        const currentWord = token.string;
        const list = pythonKeywords.filter(function(item) {
            return item.startsWith(currentWord);
        }).sort();

        return {
            list: list,
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        };
    });

    editor.setValue("print('Hello, World!')");

    return editor;
}

export { setupCodeMirror };
