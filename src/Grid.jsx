import React from "react";

const ROWS = 54;
const COLUMNS = 96;
const UP = 1;
const RIGHT = 2;
const DOWN = 4;
const LEFT = 8;

export default ({ grid }) => (
  <div className="grid">
    {grid.map((cells, row) => (
      <div className="row">
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
          return <div key={`${row},${column}`} className={className} />;
        })}
      </div>
    ))}
  </div>
);
