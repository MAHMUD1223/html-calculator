const display = document.querySelector('.up-display');
const result = document.querySelector('.result');
const historyBtn = document.querySelector(".history-btn");
const vals = ['(', ')', '÷', '×', '-', '+', '.'];
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
var historyToggle = false;

// clears one value from display
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
            hasSymbol = true;
            hasDot = false;
            bracketCount = 0;
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
    updateDisplay();
}

// clears the whole display
function clearScreen() {
    expression = [];
    result.innerHTML = '';
    hasSymbol = true;
    hasDot = false;
    bracketCount = 0;
    updateDisplay();
}

// writes the symbol to the display
function writeSymbol(symbol) {
    if (!hasSymbol && symbol == "percent") {
        expression.push(symtoval[symbol]);
        hasSymbol = false;
        hasDot = false;
    } else if (!hasSymbol) {
        expression.push(symtoval[symbol]);
        hasSymbol = true;
        hasDot = false;
    } else if (hasSymbol && expression.length > 1) {
        expression.splice(expression.length-1, 1, symtoval[symbol]);
        hasSymbol = true;
    }
    updateDisplay();
}

// writes the bracket to the display and is automatically closed if the bracket is opened
function writeBracket() {
    if (hasSymbol) {
        expression.push('(');
        bracketCount++;
    }
    else if (bracketCount > 0) {
        expression.push(')');
        bracketCount--;
    }
    else if (!hasSymbol){
        expression.push(symtoval['multiplication'])
        expression.push("(")
        bracketCount++;
    }
    updateDisplay();
}

// writes the point to the display and ensures that only one point is written for each number
function writeSymbolPoint(symbol) {
    if (!hasDot) {
        expression[expression.length - 1] += symtoval[symbol];
        hasDot = true;
    }
    updateDisplay();
}

// writes the plus or minus to the display
function writePlusMinus() {
    if (expression.length == 0) {
        return;
    } else if (expression[expression.length - 2]=="-" && expression[expression.length-3]=="(") {
        expression.splice(expression.length-3, 2);
        bracketCount--;
    } else if (expression[expression.length - 1] == "-" && expression[expression.length - 2] == "(") {
        expression.splice(expression.length-2, 2);
        bracketCount--;
    } else if (!hasSymbol){
        expression.splice(expression.length-1, 0, "(", "-");
        bracketCount++;
    }
    updateDisplay();
}

// writes the number to the display
function writeNumber(number) {
    if (expression[expression.length - 1] == '%') {
        expression.splice(expression.length , 0, symtoval['multiplication'], number);
    } else if (hasSymbol) {
        expression.push(number);
        hasDot = false;
    } else if (number == "0" && expression[(expression.length - 1) ? (expression.length - 1):0]=='0' && expression[(expression.length - 1) ? (expression.length - 1):0].length < 15) {
        return;
    } else if (expression[(expression.length - 1) ? (expression.length - 1):0] == "0" && expression[(expression.length - 1) ? (expression.length - 1):0].length < 15){
        expression[(expression.length - 1) ? (expression.length - 1):0] = number;
    } else if (expression[(expression.length - 1) ? (expression.length - 1):0].length < 15) {
        expression[(expression.length - 1) ? (expression.length - 1):0] += number;
    } else if (expression[(expression.length - 1) ? (expression.length - 1):0].length >= 15) {
        alert('Maximum number of digits reached');
        return;
    }
    hasSymbol = false;
    updateDisplay();
}

// updates the display
function updateDisplay() {
    display.innerHTML = expression.join('');
    calculate("internal");
}

// calculates the expression and updates the history
function calculate(callFrom) {
    result.style.color = "gray";
    result.style.fontSize = "2.3dvw";
    let expressionConverter = {
        '×': '*',
        '÷': '/',
        '+': '+',
        '-': '-'
    }
    let modified = 0;
    if (callFrom == "internal") {
        let bracketCount2 = bracketCount;
        while (bracketCount2 != 0) {
            expression.push(')');
            bracketCount2--;
            modified++;
        }
    } else if (callFrom == "external") {
        while (bracketCount != 0) {
            expression.push(')');
            bracketCount--;
        }
        updateDisplay();
        result.style.color = "darkcyan";
        result.style.fontSize = "3dvw";
    }
    let expressionStr = "";
    expression.forEach( (value, index) => {
        if (value == '%') {
            expressionStr += "/100";
            if (["+", "-"].indexOf(expression[index - 2]) !== -1) {
                expressionStr += "*" + expression[index - 3];
            } else if (["+", "-"].indexOf(expression[index + 1] !== -1)) {
                expressionStr += "*" + expression[index + 2];
            }
        } else if (expressionConverter[value]) {
            expressionStr += expressionConverter[value];
        } else {
            expressionStr += value;
        }
    });
    if ( callFrom == "internal" ) {
        expression.splice(expression.length - modified, modified);
    }
    let resultStr = eval(expressionStr) != undefined ? eval(expressionStr) : '';
    result.innerHTML = resultStr;
    if (callFrom == "external" && resultStr != '' && expression.length > 1) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history.push({
            time : new Date().getTime(),
            expr : expression.join(''),
            result : resultStr
        });
        localStorage.setItem('history', JSON.stringify(history));
        expression = [resultStr];
        hasDot = `${resultStr}`.includes('.');
    }
}

// notify user about cookies
const consent = localStorage.getItem('cookieConsent');
if (!consent) {
    alert("Hello Traveler,\n This site uses cookies to enhance user experience and to analyze performance and traffic on our website.");
    localStorage.setItem('cookieConsent', 'true');
}

// event listeners for showing the history
historyBtn.addEventListener('click', () => {
    let historyDiv = document.querySelector(".history-div");
    let pad = document.querySelector(".pad");
    if (!historyToggle) {
        historyToggle = true;
        historyBtn.innerHTML = "Keypad";
        historyDiv.style.display = "grid";
        pad.style.display = "none";
        let history = JSON.parse(localStorage.getItem('history')) || [];
        let historyStr = "";
        history.forEach( (value, index) => {
            historyStr += ` <div class="history-item" align="left">
                              <div class="history-time">${new Date(value.time).toLocaleString()}</div>
                              <div class="history-expr">${value.expr}</div>
                              <div class="history-result">&equals; ${value.result}</div>
                           </div>`;
        });
        document.querySelector(".history-items").innerHTML = historyStr;
    } else {
        historyToggle = false;
        historyBtn.innerHTML = "History";
        historyDiv.style.display = "none";
        pad.style.display = "grid";
    }
});

// clears the history
function clearHistory() {
    localStorage.removeItem('history');
    let historyBtn = document.querySelector(".history-btn");
    historyBtn.click();
}

function showPopup() {
    let popup = document.querySelector("#popup-window");
    popup.style.display = "block";
    document.querySelector("main").style.filter = "blur(5px)";
}
function closePopup() {
    let popup = document.querySelector("#popup-window");
    popup.style.display = "none";
    document.querySelector("main").style.filter = "none";
}


// changing Theme of the calculator
function changePage(theme) {
    switch (theme) {
        case "modern":
            window.location.href = "index.html";
            break;
        case "98":
            window.location.href = "index-98.html";
            break;
    }
}

// completed on August 8,2024 at 20:02 by MAHMUD1223