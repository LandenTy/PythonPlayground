import { outputEl, currentURL, promptInputs } from './terminal.js';

async function executeCode(code, inputs = []) {
    outputEl.textContent = "🔄 " + currentURL + "/main.py";

    // Replace all input(...) calls with provided inputs
    let inputIndex = 0;
    code = code.replace(/input\((?:'|"|`)(.*?)(?:'|"|`)\)/g, function () {
        const val = inputs[inputIndex++] || "";
        return `"${val.replace(/"/g, '\\"')}"`;
    });

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: "python",
                version: "3.10.0",
                files: [{ content: code }]
            })
        });

        if (!response.ok) throw new Error("⚠ Error executing code!");

        const result = await response.json();
        const output = result.run.output || "⚠ No output!";
        outputEl.innerHTML += `<br>> ${output}`;
    } catch (error) {
        outputEl.innerHTML += `<br>⚠ Error: ${error.message}`;
    }
}

async function compileCode(editor) {
    const code = editor.getValue();
    outputEl.innerHTML = ""; // Clear previous output

    const inputPattern = /input\((?:'|"|`)(.*?)(?:'|"|`)\)/g;
    const inputPrompts = [...code.matchAll(inputPattern)].map(match => match[1]);

    if (inputPrompts.length === 0) {
        await executeCode(code);
        return;
    }

    promptInputs(inputPrompts, executeCode, outputEl, code);
}

export { compileCode, executeCode };
