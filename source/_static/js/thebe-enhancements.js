// Simplified Enhanced Thebe functionality
(function() {
    'use strict';

    // Track Thebe status
    let thebeStatus = 'inactive';
    
    // Initialize enhanced Thebe functionality
    function initEnhancedThebe() {
        // Wait for Thebe to be available
        if (typeof thebe === 'undefined') {
            setTimeout(initEnhancedThebe, 100);
            return;
        }

        // Override thebe initialization to add minimal enhancements
        const originalInit = thebe.init;
        thebe.init = function(options) {
            // Add simple loading state to button
            const thebeButton = document.querySelector('.thebe-button');
            if (thebeButton) {
                thebeButton.classList.add('loading');
                thebeButton.textContent = 'Starting Live Code...';
                thebeStatus = 'loading';
            }

            // Call original init
            return originalInit.call(this, options).then(function() {
                thebeStatus = 'ready';
                
                // Update button state
                if (thebeButton) {
                    thebeButton.classList.remove('loading');
                    thebeButton.classList.add('active');
                    thebeButton.textContent = 'Live Code Ready';
                }

                // Add simple controls
                addSimpleControls();
                
            }).catch(function(error) {
                console.error('Thebe error:', error);
                thebeStatus = 'error';
                
                if (thebeButton) {
                    thebeButton.classList.remove('loading');
                    thebeButton.textContent = 'Live Code Error';
                }
            });
        };
    }

    // Add simple controls to code blocks
    function addSimpleControls() {
        const codeBlocks = document.querySelectorAll('.thebe-code');
        
        codeBlocks.forEach(function(block, index) {
            // Create simple controls container
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

            // Add simple output container
            const output = document.createElement('div');
            output.className = 'code-output';
            output.id = `output-${index}`;
            output.style.display = 'none';

            // Insert controls and output after code block
            block.parentNode.insertBefore(controls, block.nextSibling);
            block.parentNode.insertBefore(output, controls.nextSibling);
        });
    }

    // Store original code content
    const originalCodeContent = new Map();

    // Run code function
    window.runCode = function(index) {
        const codeBlock = document.querySelectorAll('.thebe-code')[index];
        const output = document.getElementById(`output-${index}`);
        const codeElement = codeBlock.querySelector('pre code');
        
        if (!codeElement || thebeStatus !== 'ready') {
            return;
        }

        // Store original content if not already stored
        if (!originalCodeContent.has(index)) {
            originalCodeContent.set(index, codeElement.textContent);
        }

        const code = codeElement.textContent;
        
        // Show simple loading state
        output.style.display = 'block';
        output.className = 'code-output';
        output.textContent = 'Running...';

        // Execute code using Thebe
        if (thebe && thebe.kernel) {
            thebe.kernel.execute(code).then(function(result) {
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
            output.className = 'code-output error';
            output.textContent = 'Kernel not available';
        }
    };

    // Revert code function
    window.revertCode = function(index) {
        const codeBlock = document.querySelectorAll('.thebe-code')[index];
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedThebe);
    } else {
        initEnhancedThebe();
    }

})(); 