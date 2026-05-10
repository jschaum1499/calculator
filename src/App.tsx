import { useState } from "react";

type Op = "+" | "-" | "*" | "/";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [operand, setOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Op | null>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);

  function inputDigit(digit: string) {
    if (waitingForNext) {
      setDisplay(digit);
      setWaitingForNext(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }

  function inputOperator(op: Op) {
    const current = parseFloat(display);
    if (operand !== null && !waitingForNext) {
      const result = calculate(operand, current, operator!);
      setDisplay(String(result));
      setOperand(result);
    } else {
      setOperand(current);
    }
    setOperator(op);
    setWaitingForNext(true);
  }

  function calculate(a: number, b: number, op: Op): number {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : 0;
    }
  }

  function handleEquals() {
    if (operand === null || operator === null) return;
    const current = parseFloat(display);
    const result = calculate(operand, current, operator);
    const formatted = Number.isInteger(result) ? String(result) : String(parseFloat(result.toFixed(10)));
    setDisplay(formatted);
    setOperand(null);
    setOperator(null);
    setWaitingForNext(true);
  }

  function handleClear() {
    setDisplay("0");
    setOperand(null);
    setOperator(null);
    setWaitingForNext(false);
  }

  function handleDecimal() {
    if (waitingForNext) {
      setDisplay("0.");
      setWaitingForNext(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  const btn = (label: string, onClick: () => void, testId: string, variant = "default") => (
    <button
      data-testid={testId}
      onClick={onClick}
      className={[
        "flex items-center justify-center rounded-2xl text-xl font-semibold h-16 w-full transition-all duration-100 active:scale-95 select-none",
        variant === "operator" ? "bg-amber-500 hover:bg-amber-400 text-white shadow-md" :
        variant === "equals"   ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-md" :
        variant === "clear"    ? "bg-rose-500 hover:bg-rose-400 text-white shadow-md" :
                                 "bg-white/10 hover:bg-white/20 text-white shadow-sm"
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-80 bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Display */}
        <div className="px-6 pt-8 pb-4">
          <div
            data-testid="display"
            className="text-right text-white font-light overflow-hidden"
            style={{ fontSize: display.length > 12 ? "1.5rem" : display.length > 8 ? "2rem" : "2.75rem", lineHeight: 1.1 }}
          >
            {display}
          </div>
          {operator && (
            <div className="text-right text-amber-400 text-sm mt-1 opacity-70">
              {operand} {operator}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3 p-5">
          {/* Row 1 */}
          {btn("C", handleClear, "btn-clear", "clear")}
          {btn("+/-", () => setDisplay(String(parseFloat(display) * -1)), "btn-negate")}
          {btn("%", () => setDisplay(String(parseFloat(display) / 100)), "btn-percent")}
          {btn("÷", () => inputOperator("/"), "btn-/", "operator")}

          {/* Row 2 */}
          {btn("7", () => inputDigit("7"), "btn-7")}
          {btn("8", () => inputDigit("8"), "btn-8")}
          {btn("9", () => inputDigit("9"), "btn-9")}
          {btn("×", () => inputOperator("*"), "btn-*", "operator")}

          {/* Row 3 */}
          {btn("4", () => inputDigit("4"), "btn-4")}
          {btn("5", () => inputDigit("5"), "btn-5")}
          {btn("6", () => inputDigit("6"), "btn-6")}
          {btn("−", () => inputOperator("-"), "btn--", "operator")}

          {/* Row 4 */}
          {btn("1", () => inputDigit("1"), "btn-1")}
          {btn("2", () => inputDigit("2"), "btn-2")}
          {btn("3", () => inputDigit("3"), "btn-3")}
          {btn("+", () => inputOperator("+"), "btn-+", "operator")}

          {/* Row 5 — zero spans 2 cols */}
          <button
            data-testid="btn-0"
            onClick={() => inputDigit("0")}
            className="col-span-2 flex items-center justify-start pl-6 rounded-2xl text-xl font-semibold h-16 bg-white/10 hover:bg-white/20 text-white shadow-sm transition-all duration-100 active:scale-95 select-none"
          >
            0
          </button>
          {btn(".", handleDecimal, "btn-decimal")}
          {btn("=", handleEquals, "btn-=", "equals")}
        </div>
      </div>
    </div>
  );
}
