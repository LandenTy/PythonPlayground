function makeResizable(resizer, isHorizontal) {
    resizer.addEventListener('mousedown', function (e) {
        e.preventDefault();

        if (isHorizontal) {
            const terminal = document.getElementById('terminal');
            const initialHeight = terminal.offsetHeight;
            const startY = e.clientY;

            function mouseMoveHandler(e) {
                const dy = e.clientY - startY;
                const newHeight = initialHeight - dy;
                const clampedHeight = Math.max(60, Math.min(500, newHeight));
                terminal.style.height = clampedHeight + 'px';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        } else {
            const sidebar = document.getElementById('sidebar');
            const initialWidth = sidebar.offsetWidth;
            const startX = e.clientX;

            function mouseMoveHandler(e) {
                const dx = e.clientX - startX;
                const newWidth = initialWidth + dx;
                const clampedWidth = Math.max(100, Math.min(400, newWidth));
                sidebar.style.width = clampedWidth + 'px';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        }
    });
}

function initResizable() {
    makeResizable(document.getElementById('sidebar-resizer'), false);
    makeResizable(document.getElementById('terminal-resizer'), true);
}

export { initResizable };
