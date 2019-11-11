import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import {
  ROWS,
  COLUMNS,
  EMPTY,
  UP,
  RIGHT,
  DOWN,
  LEFT,
  FULL,
  VISITED,
  PATH
} from "./constants";

const DIRECTIONS = [
  { value: UP, offsets: [-1, 0] },
  { value: RIGHT, offsets: [0, 1] },
  { value: DOWN, offsets: [1, 0] },
  { value: LEFT, offsets: [0, -1] }
];

const grid = new Array(ROWS).fill().map(_ => new Array(COLUMNS).fill(EMPTY));
const frames = [grid.map(row => row.slice())];
const generate = (row, column) => {
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
        grid[row][column] |= value;
        frames.push(grid.map(row => row.slice()));
        generate(nextRow, nextColumn);
      }
    }
    if (!grid[row][column]) {
      grid[row][column] = FULL;
      frames.push(grid.map(row => row.slice()));
    }
  }
};
generate(0, 0);

const visits = new Map();
const getNext = (row, column) => {
  return DIRECTIONS.filter(({ value }) => grid[row][column] & value)
    .map(({ offsets }) => [row + offsets[0], column + offsets[1]])
    .filter(
      ([row, column]) =>
        row >= 0 &&
        row < ROWS &&
        column >= 0 &&
        column < COLUMNS &&
        !visits.has(`${row},${column}`)
    );
};
const search = (row, column) => {
  const queue = [[row, column]];
  grid[row][column] |= VISITED;
  frames.push(grid.map(row => row.slice()));
  visits.set(`${row},${column}`, [-1, -1]);
  while (queue.length) {
    const [row, column] = queue.shift();
    for (const [nextRow, nextColumn] of getNext(row, column)) {
      queue.push([nextRow, nextColumn]);
      grid[nextRow][nextColumn] |= VISITED;
      frames.push(grid.map(row => row.slice()));
      visits.set(`${nextRow},${nextColumn}`, [row, column]);
      if (nextRow === ROWS - 1 && nextColumn === COLUMNS - 1) {
        return;
      }
    }
  }
};
search(0, 0);

let path = [];
for (
  let [row, column] = [ROWS - 1, COLUMNS - 1];
  visits.has(`${row},${column}`);
  [row, column] = visits.get(`${row},${column}`)
) {
  path.push([row, column]);
}
for (const [row, column] of path.reverse()) {
  grid[row][column] |= PATH;
  frames.push(grid.map(row => row.slice()));
}

export default () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex(Math.max(0, Math.min(index + 2, frames.length - 1)));
    }, 1000 / 60);
    return () => clearTimeout(timeout);
  }, [index]);

  return <Grid grid={frames[index]} />;
};
