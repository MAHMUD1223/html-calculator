const display = document.querySelector('.up-display');
const result = document.querySelector('.result');
const vals = ['(', ')', '%', '÷', '×', '-', '+', '.'];
const symtoval = {
    'bracket-opening': '(',
    'bracket-closing': ')',
    'percent': '%',
    'division': '÷',
    'multiplication': '×',
    'minus': '-',
    'plus': '+',
    'point': '.',
    'equals': '='
}
var symbolsUsed = [];
var expression = [];
var hasSymbol = true;
var hasDot = false;
var bracketCount = 0
function clearOne() {
    if (expression[expression.length - 1].length === 1 ) {
        hasSymbol = false;
        expression.pop();
        let newLast = expression[expression.length - 1];
        if (newLast === '(' ) {
            bracketCount--;
        }
        else if (newLast === ')' ) {
            bracketCount++;
        }
        else if (newLast.includes('.')) {
            hasDot = true;
        }
        else if (vals.indexOf(newLast) !== -1 && newLast !== '.' && newLast !== ')' && newLast !== '(') {
            hasSymbol = true;
        }
    }
    else {
        expression[expression.length - 1] = expression[expression.length - 1].slice(0, -1);
    }
    // display.innerHTML = display.innerHTML.slice(0, -1);
    updateDisplay();
}
function clearScreen() {
    expression = [];
    /// display.innerHTML = '';
    result.innerHTML = '';
    updateDisplay();
}
function writeSymbol(symbol) {
    if (!hasSymbol) {
        expression.push(symtoval[symbol]);
        symbolsUsed.push(symtoval[symbol]);
        hasSymbol = true;
        hasDot = false;
        // display.innerHTML += symtoval[symbol];
    }
    updateDisplay();
}
function writeBracket() {
    if (hasSymbol) {
        expression.push('(');
        symbolsUsed.push('(');
        bracketCount++;
        // display.innerHTML += '(';
    }
    else if (!hasSymbol && bracketCount > 0) {
        expression.push(')');
        symbolsUsed.push(')');
        bracketCount--;
        // display.innerHTML += ')';
    }
    else if (!hasSymbol && bracketCount === 0 && parseFloat(expression[expression.length - 1]) > 0) {
        expression.push('(');
        symbolsUsed.push('(');
        bracketCount++;
        // display.innerHTML += '(';
    }
    updateDisplay();
}
function writeSymbolPoint(symbol) {
    if (!hasDot) {
        expression[expression.length - 1] += symtoval[symbol];
        hasDot = true;
        // display.innerHTML += symtoval[symbol];
    }
    updateDisplay();
}
function writeNumber(number) {
    if (hasSymbol || vals.indexOf(expression[expression.length - 1]) !== -1) {
        expression.push(number);
        hasDot = false;
    }
    else if (expression[expression.length - 1].length < 15) {
        expression[expression.length - 1] += number;
    }
    else if (expression[expression.length - 1].length >= 15) {
        alert('Maximum number of digits reached');
        return;
    }
    hasSymbol = false;
    // display.innerHTML += number;
    updateDisplay();
}
function updateDisplay() {
    display.innerHTML = expression.join('');
    // alert(expression.join(''));
}