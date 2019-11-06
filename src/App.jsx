import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import { ROWS, COLUMNS, EMPTY, UP, RIGHT, DOWN, LEFT, FULL } from "./constants";

const DIRECTIONS = [
  { value: UP, offsets: [-1, 0] },
  { value: RIGHT, offsets: [0, 1] },
  { value: DOWN, offsets: [1, 0] },
  { value: LEFT, offsets: [0, -1] }
];

const grid = new Array(ROWS).fill().map(_ => new Array(COLUMNS).fill(EMPTY));
const frames = [grid.map(row => row.slice())];
const search = (row, column) => {
  if (row === ROWS - 1 && column === COLUMNS - 1) {
    grid[row][column] = FULL;
    frames.push(grid.map(row => row.slice()));
  } else {
    const directions = DIRECTIONS.map(({ value, offsets }) => ({
      value,
      nextRow: row + offsets[0],
      nextColumn: column + offsets[1]
    }))
      .filter(
        ({ nextRow, nextColumn }) =>
          nextRow >= 0 &&
          nextRow < ROWS &&
          nextColumn >= 0 &&
          nextColumn < COLUMNS
      )
      .sort(() => Math.random() - 0.5);
    for (const { value, nextRow, nextColumn } of directions) {
      if (!grid[nextRow][nextColumn]) {
        grid[row][column] = grid[row][column] | value;
        frames.push(grid.map(row => row.slice()));
        search(nextRow, nextColumn);
      }
    }
    if (!grid[row][column]) {
      grid[row][column] = FULL;
      frames.push(grid.map(row => row.slice()));
    }
  }
};
search(0, 0);

export default () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex(Math.max(0, Math.min(index + 8, frames.length - 1)));
    }, 1000 / 60);
    return () => clearTimeout(timeout);
  }, [index]);

  return <Grid grid={frames[index]} />;
};
