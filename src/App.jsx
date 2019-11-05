import React from "react";
import Grid from "./Grid";

const ROWS = 54;
const COLUMNS = 96;
const UP = { value: 1, offsets: [-1, 0] };
const RIGHT = { value: 2, offsets: [0, 1] };
const DOWN = { value: 4, offsets: [1, 0] };
const LEFT = { value: 8, offsets: [0, -1] };
const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

const grid = new Array(ROWS).fill().map(_ => new Array(COLUMNS).fill(0));
const search = (row, column) => {
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
      search(nextRow, nextColumn);
    }
  }
  if (!grid[row][column]) {
    grid[row][column] = 16;
  }
};
search(0, 0);

export default () => <Grid grid={grid} />;
