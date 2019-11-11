import React from "react";
import {
  ROWS,
  COLUMNS,
  UP,
  RIGHT,
  DOWN,
  LEFT,
  VISITED,
  PATH
} from "./constants";

export default ({ grid }) => (
  <div className="grid">
    {grid.map((cells, row) => (
      <div key={row} className="row">
        {cells.map((cell, column) => {
          let className = "cell";
          if (cell & UP || (row > 0 && grid[row - 1][column] & DOWN)) {
            className += " up";
          }
          if (
            cell & RIGHT ||
            (column < COLUMNS - 1 && grid[row][column + 1] & LEFT)
          ) {
            className += " right";
          }
          if (cell & DOWN || (row < ROWS - 1 && grid[row + 1][column] & UP)) {
            className += " down";
          }
          if (cell & LEFT || (column > 0 && grid[row][column - 1] & RIGHT)) {
            className += " left";
          }
          if (cell & VISITED) {
            className += " visited";
          }
          if (cell & PATH) {
            className += " path";
          }
          return <div key={`${row},${column}`} className={className} />;
        })}
      </div>
    ))}
  </div>
);
