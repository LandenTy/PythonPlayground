import { setupCodeMirror } from './codemirror-setup.js';
import { compileCode } from './code-execution.js';
import { initResizable } from './resizable.js';

// DOM Elements
const terminalTabBtn = document.getElementById('terminal-tab');
const shellTabBtn = document.getElementById('shell-tab');
const terminalEl = document.getElementById('terminal');
const shellEl = document.getElementById('shell');
const shellInput = shellEl.querySelector('.terminal-input');
const shellOutput = document.getElementById('shell-output');

const commands = {
    help() {
        return "Available commands: echo, clear, date, ping";
    },
    clear() {
        document.getElementById("shell-output").innerHTML = "";
        return null;
    },
    echo(args) {
        return args.join(" ");
    },
    ping(args) {
        const target = args[0] || 'localhost';
        const lines = [];

        for (let i = 0; i < 4; i++) {
            const time = Math.floor(Math.random() * 20 + 10); // e.g. 10–30 ms
            lines.push(`Reply from ${target}: bytes=32 time=${time}ms TTL=64`);
        }

        lines.push('');
        lines.push(`Ping statistics for ${target}:`);
        lines.push(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`);
        lines.push(`Approximate round trip times in milli-seconds:`);
        lines.push(`    Minimum = 10ms, Maximum = 30ms, Average = 20ms`);

        return lines.join('\n');
    },
};


// Tab Switching
terminalTabBtn.addEventListener('click', () => {
    terminalTabBtn.classList.add('active');
    shellTabBtn.classList.remove('active');
    terminalEl.classList.remove('hidden');
    shellEl.classList.add('hidden');
});

shellTabBtn.addEventListener('click', () => {
    shellTabBtn.classList.add('active');
    terminalTabBtn.classList.remove('active');
    shellEl.classList.remove('hidden');
    terminalEl.classList.add('hidden');
    shellInput.focus();
});

// Shell Input Handler
shellInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const inputText = shellInput.textContent.trim();

        // Add command line to shell output in one line
        const commandLine = document.createElement('div');
        commandLine.classList.add('terminal-line');
        commandLine.textContent = `$ ${inputText}`;
        shellOutput.appendChild(commandLine);

        shellInput.textContent = '';

        const [command, ...args] = inputText.split(/\s+/);

        if (commands.hasOwnProperty(command)) {
            const result = commands[command](args);
            if (result !== null && result !== undefined) {
                const resultLine = document.createElement('div');
                resultLine.classList.add('terminal-line');
                resultLine.textContent = result;
                shellOutput.appendChild(resultLine);
            }
        } else if (command.length > 0) {
            const errorLine = document.createElement('div');
            errorLine.classList.add('terminal-line');
            errorLine.textContent = `Command not found: ${command}`;
            shellOutput.appendChild(errorLine);
        }

        shellOutput.scrollTop = shellOutput.scrollHeight;
    }
});

// DOM Loaded
document.addEventListener('DOMContentLoaded', function () {
    const editor = setupCodeMirror();

    const runButton = document.querySelector(".run-btn");
    runButton.addEventListener('click', function () {
        compileCode(editor);
    });

    initResizable();
});
