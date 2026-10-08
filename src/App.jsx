import { useState } from 'react';
import './App.css'

const FULL_NAME = "Alexander Jude Cruz";

function CalcDisplay({dispValue}){
  // long text (like the full name) gets a smaller font so it fits
  const displayClass = String(dispValue).length > 9 ? 'Display Long' : 'Display';
  return(
    <div className={displayClass}>
          {dispValue}
      </div>
  );
}

function CalcButton({buttonLabel, buttonClassname = 'Button', onClick}){
  return(
    <button className= {buttonClassname} onClick={onClick}>
      {buttonLabel}
    </button>
  );
}

function App() {
  const [disp, setDisp] = useState("0");
  const [operand1, setOperand1] = useState(null); // first number
  const [operand2, setOperand2] = useState(null); // operator
  const [operand3, setOperand3] = useState(null); // second number

  const calculate = (a, op, b) => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    let result;
    if (op === "+") result = x + y;
    else if (op === "-") result = x - y;
    else if (op === "*") result = x * y;
    else if (op === "÷") {
      if (y === 0) return "Error";
      result = x / y;
    }
    return String(parseFloat(result.toFixed(10)));
  };

  const buttonClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    // Surname button: show full name and reset the calculation
    if (value === "CRUZ") {
      setDisp(FULL_NAME);
      setOperand1(null);
      setOperand2(null);
      setOperand3(null);
      return;
    }

    // Digits
    if (/^\d$/.test(value)) {
      if (operand2 === null) {
        // typing the first number (or starting fresh after "=")
        if (operand1 !== null) setOperand1(null);
        const startFresh = operand1 !== null || disp === "0" || disp === "Error" || disp === FULL_NAME;
        setDisp(startFresh ? value : disp + value);
      } else {
        // typing the second number
        const next = operand3 === null || operand3 === "0" ? value : operand3 + value;
        setOperand3(next);
        setDisp(next);
      }
      return;
    }

    // Clear
    if (value === "CLR") {
      setDisp("0");
      setOperand1(null);
      setOperand2(null);
      setOperand3(null);
      return;
    }

    // Equals
    if (value === "=") {
      if (operand2 !== null && operand3 !== null) {
        const result = calculate(operand1, operand2, operand3);
        setDisp(result);
        setOperand1(result === "Error" ? null : result);
        setOperand2(null);
        setOperand3(null);
      }
      return;
    }

    // Operators (+ - * ÷)
    if (disp === "Error" || disp === FULL_NAME) return;
    if (operand2 !== null && operand3 !== null) {
      // chain: 2 + 3 + ... → compute first, then continue
      const result = calculate(operand1, operand2, operand3);
      if (result === "Error") {
        setDisp(result);
        setOperand1(null);
        setOperand2(null);
        setOperand3(null);
        return;
      }
      setOperand1(result);
      setOperand2(value);
      setOperand3(null);
      setDisp(value);          // show the operator
    } else if (operand2 !== null) {
      // operator pressed twice: just swap it
      setOperand2(value);
      setDisp(value);          // show the new operator
    } else {
      setOperand1(disp);
      setOperand2(value);
      setOperand3(null);
      setDisp(value);          // show the operator
    }
  }

  return (
    <div className= 'App'>
      <div className='Header'> Calculator of Alexander Jude Cruz- WMD3A</div>
      <div className='Calculator'>
        <CalcDisplay dispValue={disp}/>
        <div className='Keypad'>
        <CalcButton buttonLabel={7} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={8} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={9} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"+"} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={4} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={5} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={6} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"*"} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={1} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={2} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={3} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"-"} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"C"} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={0} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"="} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"÷"} onClick={buttonClickHandler}/>
        <CalcButton buttonLabel={"CRUZ"} buttonClassname='Button NameButton' onClick={buttonClickHandler}/>
        </div>
      </div>
    </div>
   
  )
}

export default App
