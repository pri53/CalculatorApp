let display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;
let displayExpression = '0'; // Full expression to show on display

function updateDisplay() {
    // Format the display to handle large numbers
    const displayText = displayExpression || currentInput;
    if (displayText.length > 12) {
        display.style.fontSize = '36px';
    } else if (displayText.length > 9) {
        display.style.fontSize = '42px';
    } else {
        display.style.fontSize = '48px';
    }
    
    display.textContent = displayText;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '0';
        displayExpression = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
        if (operator) {
            displayExpression = previousInput + getOperatorSymbol(operator) + number;
        } else {
            displayExpression = number;
        }
    } else {
        // Prevent input overflow
        if (currentInput.length < 15) {
            currentInput += number;
            if (operator) {
                displayExpression = previousInput + getOperatorSymbol(operator) + currentInput;
            } else {
                displayExpression = currentInput;
            }
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        displayExpression = '0';
        shouldResetDisplay = false;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
        if (operator) {
            displayExpression = previousInput + getOperatorSymbol(operator) + currentInput;
        } else {
            displayExpression = currentInput;
        }
        updateDisplay();
    }
}

function getOperatorSymbol(op) {
    const symbols = {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷',
        '%': '%'
    };
    return symbols[op] || op;
}

function appendOperator(op) {
    if (previousInput && operator && !shouldResetDisplay) {
        calculate();
        // After calculation, set up for next operation
        previousInput = currentInput;
        operator = op;
        displayExpression = currentInput + getOperatorSymbol(op);
        shouldResetDisplay = true;
        updateDisplay();
        return;
    }
    
    previousInput = currentInput;
    operator = op;
    displayExpression = currentInput + getOperatorSymbol(op);
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    displayExpression = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldResetDisplay) {
        return;
    }
    
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    
    if (operator) {
        displayExpression = previousInput + getOperatorSymbol(operator) + currentInput;
    } else {
        displayExpression = currentInput;
    }
    updateDisplay();
}

function calculate() {
    if (!previousInput || !operator) {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                currentInput = 'Error';
                displayExpression = 'Error';
                previousInput = '';
                operator = '';
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    
    // Format result to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;
    
    // Convert to string and limit decimal places
    if (result.toString().length > 12) {
        result = result.toExponential(6);
    } else {
        result = result.toString();
    }
    
    currentInput = result;
    displayExpression = result;
    previousInput = '';
    operator = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Initialize display
updateDisplay();

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendDecimal();
    } else if (key === '+') {
        appendOperator('+');
    } else if (key === '-') {
        appendOperator('-');
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        event.preventDefault();
        appendOperator('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '%') {
        appendOperator('%');
    }
});

