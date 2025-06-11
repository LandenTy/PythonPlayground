const outputEl = document.getElementById('output');
const currentURL = window.location.href;

// Prevent Ctrl+S / Cmd+S default save
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
    }
});

// Terminal mouse interactions and focus management
outputEl.addEventListener('mousedown', function (e) {
    const isClickInsideInput = e.target.classList.contains('terminal-input');
    const active = document.activeElement;

    if (!isClickInsideInput && active && active.classList.contains('terminal-input')) {
        e.preventDefault();
    }
});

outputEl.addEventListener('click', function (e) {
    const inputs = [...document.querySelectorAll('.terminal-input')];
    const last = inputs[inputs.length - 1];

    if (!last) return;
    if (!last.isContentEditable || document.activeElement === last) return;

    if (e.target === outputEl || e.target.classList.contains('terminal-line')) {
        last.focus();
    }
});

document.addEventListener('keydown', function (e) {
    if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(e.key) &&
        document.activeElement.classList.contains('terminal-input')
    ) {
        e.preventDefault();
    }
});

// Function to prompt user inline inputs for input() calls in Python code
function promptInputs(inputPrompts, executeCode, outputElement, code) {
    let currentPrompt = 0;
    const inputs = [];

    function showNextPrompt() {
        if (currentPrompt >= inputPrompts.length) {
            executeCode(code, inputs);
            return;
        }

        const prompt = inputPrompts[currentPrompt];

        const line = document.createElement('div');
        line.classList.add('terminal-line');

        const label = document.createElement('span');
        label.textContent = `> ${prompt}: `;
        label.classList.add('terminal-prompt');

        const inputSpan = document.createElement('span');
        inputSpan.classList.add('terminal-input');
        inputSpan.contentEditable = true;
        inputSpan.spellcheck = false;

        inputSpan.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const inputValue = inputSpan.textContent.trim();
                inputs.push(inputValue);
                inputSpan.contentEditable = false;
                currentPrompt++;
                showNextPrompt();
            }
        });

        line.appendChild(label);
        line.appendChild(inputSpan);
        outputElement.appendChild(line);
        inputSpan.focus();
    }

    showNextPrompt();
}

export { outputEl, currentURL, promptInputs };
