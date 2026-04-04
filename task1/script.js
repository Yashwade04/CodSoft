class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.error = false;
  }

  delete() {
    if (this.error) {
        this.clear();
        return;
    }
    if (this.currentOperand === '0') return;
    
    // If it's a single digit or a single digit with a minus sign, reset to 0
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
  }

  appendNumber(number) {
    if (this.error) this.clear();
    // Prevent multiple decimals
    if (number === '.' && this.currentOperand.includes('.')) return;
    
    // Replace initial 0, unless adding a decimal
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.error) return;
    
    // Handle changing operation before providing second number
    if (this.currentOperand === '' && this.previousOperand !== '') {
        this.operation = operation;
        return;
    }
    if (this.currentOperand === '') return;
    
    // If we already have an operation chained, compute it first
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
            this.handleError("Divide by Zero");
            return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }
    
    // Handle floating point precision issues (e.g., 0.1 + 0.2 = 0.3)
    computation = Math.round(computation * 1e12) / 1e12;
    
    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
  }

  computePercent() {
      if (this.error) return;
      if (this.currentOperand === '') return;
      
      const current = parseFloat(this.currentOperand);
      if (isNaN(current)) return;
      
      // Calculate percentage
      this.currentOperand = (current / 100).toString();
  }

  handleError(msg) {
      this.error = true;
      this.currentOperand = msg;
      this.previousOperand = '';
      this.operation = undefined;
  }

  getDisplayNumber(number) {
    if (number === "Divide by Zero") return number;
    if (number === '-' || number === '') return number;
    
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      // Use toLocaleString for nice comma separation on thousands
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    if (this.error) {
        this.currentOperandTextElement.innerText = this.currentOperand;
        this.previousOperandTextElement.innerText = '';
        return;
    }
    
    this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
    
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = 
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

// DOM Elements Initialization
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const percentButton = document.querySelector('[data-action="percent"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners for Buttons
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.dataset.number);
    calculator.updateDisplay();
    animateButton(button);
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.dataset.operator);
    calculator.updateDisplay();
    animateButton(button);
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
  animateButton(equalsButton);
});

clearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
  animateButton(clearButton);
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
  animateButton(deleteButton);
});

percentButton.addEventListener('click', () => {
  calculator.computePercent();
  calculator.updateDisplay();
  animateButton(percentButton);
});

// Keyboard Support
document.addEventListener('keydown', e => {
  const key = e.key;
  
  // Numbers and Decimal
  if ((key >= '0' && key <= '9') || key === '.') {
      const btn = Array.from(numberButtons).find(b => b.dataset.number === key);
      if (btn) {
          calculator.appendNumber(key);
          calculator.updateDisplay();
          animateButton(btn);
      }
  }
  
  // Operations
  if (key === '+' || key === '-' || key === '*' || key === '/') {
      let op = key;
      if (key === '*') op = '×';
      if (key === '/') op = '÷';
      const btn = Array.from(operationButtons).find(b => b.dataset.operator === op);
      if (btn) {
          calculator.chooseOperation(op);
          calculator.updateDisplay();
          animateButton(btn);
      }
  }
  
  // Actions
  if (key === 'Enter' || key === '=') {
      e.preventDefault(); // Prevent accidental form submission or button focus trigger
      calculator.compute();
      calculator.updateDisplay();
      animateButton(equalsButton);
  }
  if (key === 'Backspace') {
      calculator.delete();
      calculator.updateDisplay();
      animateButton(deleteButton);
  }
  if (key === 'Escape') {
      calculator.clear();
      calculator.updateDisplay();
      animateButton(clearButton);
  }
  if (key === '%') {
      calculator.computePercent();
      calculator.updateDisplay();
      animateButton(percentButton);
  }
});

// Utility to animate button on press
function animateButton(btn) {
    btn.classList.add('keyboard-active');
    setTimeout(() => {
        btn.classList.remove('keyboard-active');
    }, 150); // Matches smooth transition timing
}

// Dark/Light Theme Toggle Control
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
const icon = themeBtn.querySelector('i');

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    
    // Toggle Icon Font Awesome
    if(isLight) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});
