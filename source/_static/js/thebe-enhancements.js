// Simple Thebe enhancements
(function() {
    'use strict';

    // Wait for page to load
    function init() {
        console.log('Thebe enhancements initializing...');

        // Check if we're on a page with Thebe
        const thebeButton = document.querySelector('.thebe-button');
        if (!thebeButton) {
            console.log('No Thebe button found');
            return; // Not a Thebe page
        }

        // Add loading state to button
        thebeButton.addEventListener('click', function() {
            thebeButton.textContent = 'Starting Live Code...';
            thebeButton.classList.add('loading');
            
            // Wait a bit then add controls
            setTimeout(addControls, 2000);
        });

        // Also try to add controls immediately if code blocks exist
        setTimeout(function() {
            const codeBlocks = document.querySelectorAll('.thebe-code');
            if (codeBlocks.length > 0) {
                console.log('Found code blocks, adding controls');
                addControls();
            }
        }, 1000);

        // Monitor for Thebe activation
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const codeBlocks = document.querySelectorAll('.thebe-code');
                    if (codeBlocks.length > 0) {
                        // Thebe is active, add controls
                        setTimeout(addControls, 1000);
                        observer.disconnect();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Add simple controls to code blocks
    function addControls() {
        console.log('Adding controls to code blocks...');
        
        const codeBlocks = document.querySelectorAll('.thebe-code');
        if (codeBlocks.length === 0) {
            console.log('No code blocks found');
            return;
        }

        codeBlocks.forEach(function(block, index) {
            // Check if controls already exist
            if (block.parentNode.querySelector('.code-controls')) {
                return;
            }

            console.log('Adding controls to block', index);

            // Create controls
            const controls = document.createElement('div');
            controls.className = 'code-controls';
            controls.innerHTML = `
                <button class="run-button" onclick="runCode(${index})">
                    ▶️ Run
                </button>
                <button class="revert-button" onclick="revertCode(${index})">
                    ↩️ Reset
                </button>
            `;

            // Create output area
            const output = document.createElement('div');
            output.className = 'code-output';
            output.id = `output-${index}`;
            output.style.display = 'none';

            // Insert after the code block
            block.parentNode.insertBefore(controls, block.nextSibling);
            block.parentNode.insertBefore(output, controls.nextSibling);
        });
    }

    // Store original code content
    const originalCodeContent = new Map();

    // Run code function
    window.runCode = function(index) {
        console.log('Running code for block', index);
        
        const codeBlocks = document.querySelectorAll('.thebe-code');
        const codeBlock = codeBlocks[index];
        const output = document.getElementById(`output-${index}`);
        
        if (!codeBlock || !output) {
            console.log('Code block or output not found');
            return;
        }

        const codeElement = codeBlock.querySelector('pre code');
        if (!codeElement) {
            console.log('Code element not found');
            return;
        }

        // Store original content if not already stored
        if (!originalCodeContent.has(index)) {
            originalCodeContent.set(index, codeElement.textContent);
        }

        const code = codeElement.textContent;
        
        // Show loading
        output.style.display = 'block';
        output.className = 'code-output';
        output.textContent = 'Running...';

        // Try to execute with Thebe
        if (window.thebe && window.thebe.kernel) {
            console.log('Using Thebe kernel');
            window.thebe.kernel.execute(code).then(function(result) {
                if (result.content.status === 'ok') {
                    output.className = 'code-output success';
                    output.textContent = result.content.text || 'Success!';
                } else {
                    output.className = 'code-output error';
                    output.textContent = result.content.text || 'Error';
                }
            }).catch(function(error) {
                output.className = 'code-output error';
                output.textContent = 'Error: ' + error.message;
            });
        } else {
            console.log('Thebe kernel not available, showing demo output');
            // Demo output for testing
            output.className = 'code-output success';
            output.textContent = 'Demo: Code would execute here in live environment';
        }
    };

    // Revert code function
    window.revertCode = function(index) {
        console.log('Reverting code for block', index);
        
        const codeBlocks = document.querySelectorAll('.thebe-code');
        const codeBlock = codeBlocks[index];
        const codeElement = codeBlock.querySelector('pre code');
        const originalCode = originalCodeContent.get(index);
        const output = document.getElementById(`output-${index}`);
        
        if (codeElement && originalCode) {
            codeElement.textContent = originalCode;
        }
        
        if (output) {
            output.style.display = 'none';
            output.textContent = '';
        }
    };

    // Debug function to manually add controls
    window.debugAddControls = function() {
        console.log('Manually adding controls...');
        addControls();
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also try after a longer delay as fallback
    setTimeout(function() {
        const codeBlocks = document.querySelectorAll('.thebe-code');
        if (codeBlocks.length > 0) {
            console.log('Fallback: Adding controls after delay');
            addControls();
        }
    }, 5000);

})(); 