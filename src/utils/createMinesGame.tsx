import { useState } from "react";
import { v4 } from "uuid";

export const useCreateMinesGame = (gridSize = 5) => {
  const [mines, setMines] = useState<number>(0);
  const [result, setResult] = useState<"mine" | "win" | "safe">("safe");
  const [grid, setGrid] = useState(() =>
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({
        isRevealed: false,
        hasMine: false,
        fieldId: v4(),
      }))
    )
  );
  const [fieldsRevealed, setFieldsRevealed] = useState(0);

  const reset = () => {
    setMines(0);
    setFieldsRevealed(0);
    setResult("safe");
    setGrid(
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
          isRevealed: false,
          hasMine: false,
          fieldId: v4(),
        }))
      )
    );
  };

  const placeMines = (minesCount: number) => {
    const flattenedGrid = grid.flat();
    const mineFields = flattenedGrid
      .sort(() => Math.random() - 0.5)
      .slice(0, minesCount);

    const newGrid = grid.map((row) =>
      row.map((field) =>
        mineFields.some((mineField) => mineField.fieldId === field.fieldId)
          ? { ...field, hasMine: true }
          : field
      )
    );
    setGrid(newGrid);
  };

  const getRevealResult = (fieldId: string) => {
    const newGrid = grid.map((row) =>
      row.map((field) =>
        field.fieldId === fieldId ? { ...field, isRevealed: true } : field
      )
    );

    setGrid(newGrid);
    const revealedField = newGrid.flat().find((f) => f.fieldId === fieldId);

    if (revealedField?.hasMine) {
      setResult("mine");
      setFieldsRevealed(0); // Reset revealed fields
      showRandomResultsOnGameEnd();
    } else {
      const newFieldsRevealed = fieldsRevealed + 1;
      setFieldsRevealed(newFieldsRevealed);
      if (newFieldsRevealed === gridSize * gridSize - mines) {
        setResult("win");
      }
    }
  };

  const showRandomResultsOnGameEnd = () => {
    const newGrid = grid.map((row) =>
      row.map((field) =>
        field.hasMine ? { ...field, isRevealed: true } : field
      )
    );
    setGrid(newGrid);
  };

  return {
    gridSize,
    mines,
    setMines,
    fieldsRevealed,
    getRevealResult,
    grid,
    reset,
    placeMines,
    result,
  };
};
