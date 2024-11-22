import { useState } from "react";
import "./App.css";
import { useCreateMinesGame } from "./utils/createMinesGame";

export default function App() {
  const [minesInputValue, setMinesInputValue] = useState<number>(0);
  const {
    setMines,
    mines,
    gridSize,
    result,
    grid,
    reset,
    getRevealResult,
    placeMines,
  } = useCreateMinesGame(5); // 5x5 grid

  const startGame = () => {
    setMines(minesInputValue);
    placeMines(minesInputValue);
  };

  if (!mines) {
    return (
      <div>
        <label>
          Mines:
          <input
            type="number"
            min="1"
            max="24"
            value={minesInputValue}
            onChange={(e) =>
              setMinesInputValue(
                parseInt(e.target.value) > 24
                  ? 24
                  : parseInt(e.target.value) < 1
                  ? 1
                  : parseInt(e.target.value)
              )
            }
          />
        </label>
        <button onClick={startGame}>Start</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1>
        {result === "mine"
          ? "You lost!"
          : result === "win"
          ? "You won!"
          : "Stake mines recreated"}
      </h1>
      {result !== "safe" && (
        <div className={result === "win" ? "win-message" : "loss-message"}>
          {result === "win"
            ? "Congratulations, You Won!"
            : "Boom! You Hit a Mine!"}
        </div>
      )}
      <div>
        {!mines && (
          <div>
            <input
              type="number"
              min="1"
              max={gridSize * gridSize - 1}
              value={minesInputValue}
              onChange={(e) => setMinesInputValue(parseInt(e.target.value))}
            />
            <button onClick={startGame}>Start</button>
          </div>
        )}
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((field) => (
              <button
                className={`cell ${
                  field.isRevealed
                    ? field.hasMine
                      ? "mine revealed"
                      : "revealed"
                    : ""
                }`}
                disabled={result !== "safe" || field.isRevealed}
                onClick={() => getRevealResult(field.fieldId)}
                key={field.fieldId}
              >
                {field.isRevealed && field.hasMine ? "M" : ""}
              </button>
            ))}
          </div>
        ))}
      </div>
      {result !== "safe" && <button onClick={reset}>Restart</button>}
    </div>
  );
}
