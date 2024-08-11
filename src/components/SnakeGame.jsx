import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 15;
const GAMEGRID = Array.from({ length: GRID_SIZE }, () =>
  new Array(GRID_SIZE).fill("")
);
const INITIAL_SNAKE = [[5, 5]];

const generateFood = () => {
  const x = Math.floor(Math.random() * GRID_SIZE);
  const y = Math.floor(Math.random() * GRID_SIZE);
  return [x, y];
};

export default function SnakeGame() {
  const [snakeBody, setSnakeBody] = useState(INITIAL_SNAKE);

  const directionRef = useRef([1, 0]);
  const foodRef = useRef(generateFood());

  const isSnakeBodyDiv = (xy, yc) => {
    return snakeBody.some(([x, y]) => x === xy && y === yc);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnakeBody((prevSnakeBody) => {
        const newHead = [
          prevSnakeBody[0][0] + directionRef.current[0],
          prevSnakeBody[0][1] + directionRef.current[1],
        ];

        // Check for collisions with walls or self
        if (
          newHead[0] < 0 ||
          newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 ||
          newHead[1] >= GRID_SIZE ||
          prevSnakeBody.some(([x, y]) => newHead[0] === x && newHead[1] === y)
        ) {
          directionRef.current = [1, 0];
          return INITIAL_SNAKE;
        }

        const copySnakeBody = [newHead, ...prevSnakeBody]; // Add new head to the start

        if (
          newHead[0] === foodRef.current[0] &&
          newHead[1] === foodRef.current[1]
        ) {
          // Snake eats the food: generate new food
          foodRef.current = generateFood();
        } else {
          // Snake doesn't eat food: remove the tail
          copySnakeBody.pop();
        }

        return copySnakeBody;
      });
    }, 1000);

    const handleDirection = (e) => {
      const key = e.key;
      if (key === "ArrowUp" && directionRef.current[1] !== 1) {
        directionRef.current = [0, -1];
      } else if (key === "ArrowLeft" && directionRef.current[0] !== 1) {
        directionRef.current = [-1, 0];
      } else if (key === "ArrowRight" && directionRef.current[0] !== -1) {
        directionRef.current = [1, 0];
      } else if (key === "ArrowDown" && directionRef.current[1] !== -1) {
        directionRef.current = [0, 1];
      }
    };

    window.addEventListener("keydown", handleDirection);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleDirection);
    };
  }, []);

  return (
    <div className="container">
      {GAMEGRID.map((row, yc) => {
        return row.map((cell, xc) => (
          <div
            key={`${xc}-${yc}`}
            className={`cell ${isSnakeBodyDiv(xc, yc) ? "snake" : ""} ${
              foodRef.current[0] === xc && foodRef.current[1] === yc
                ? "food"
                : ""
            }`}
          ></div>
        ));
      })}
    </div>
  );
}
