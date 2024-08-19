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
var expression = [];
var hasSymbol = true;
var hasDot = false;
var bracketCount = 0;
function clearOne() {
    if (expression[(expression.length - 1) ? (expression.length - 1):0].length === 1) {
        hasSymbol = false;
        let lastElm = expression[(expression.length - 1) ? (expression.length - 1):0];
        if (lastElm === '(' ) {
            bracketCount--;
        }
        else if (lastElm === ')' ) {
            bracketCount++;
        }

        expression.pop();
        if(expression.length == 0){
            updateDisplay();
            // display.innerHTML = "0"
            return;
        }

        let newLast = expression[(expression.length - 1) ? (expression.length - 1):0];
        if (newLast.includes('.')) {
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
        hasSymbol = true;
        hasDot = false;
        // display.innerHTML += symtoval[symbol];
    }
    updateDisplay();
}
function writeBracket() {
    // this has bug and we are gonna fix it
    if (hasSymbol) {
        if(expression.length > 0 && vals.indexOf(expression[(expression.length - 1) ? (expression.length - 1):0]) == -1) {
            expression.push(symtoval['multiplication']);
        }
        expression.push('(');
        bracketCount++;
        // display.innerHTML += '(';
    }
    else if (!hasSymbol && bracketCount > 0) {
        expression.push(')');
        bracketCount--;
        // display.innerHTML += ')';
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
    if (hasSymbol) {
        expression.push(number);
        hasDot = false;
    }
    else if (expression[(expression.length - 1) ? (expression.length - 1):0].length < 15) {
        expression[(expression.length - 1) ? (expression.length - 1):0] += number;
    }
    else if (expression[(expression.length - 1) ? (expression.length - 1):0].length >= 15) {
        alert('Maximum number of digits reached');
        return;
    }
    hasSymbol = false;
    // display.innerHTML += number;
    updateDisplay();
}
function updateDisplay() {
    display.innerHTML = expression.join('');
    alert(expression);
}