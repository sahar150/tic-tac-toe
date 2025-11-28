import { useState } from "react"

function getWinSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function Square({ value, isHighlighted, onSquareClick }) {
  return <button className={"square " + (isHighlighted ? "highlighted" : "")} onClick={onSquareClick}>{ value }</button>
}


function GameBoard({ xIsNext, squares, onPlay}) {
  function handleClick(index) {
    if( (squares[index]) || winSquares )return;

    const nextSquares = squares.slice()
     if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }
    onPlay(nextSquares);
  }

  const winSquares = getWinSquares(squares);
  const winner = winSquares ? squares[winSquares[0]] : null;
  let status;

  if (winner) {
    status = `The winner is ${winner}`
  } else {
    status = `The next player is: ${xIsNext ? 'X' : 'O'}`
  }

  if (!winner && !squares.includes(null)) {
    status = "The game ended in a draw."
  }

  const boardRows = [];

  for (let i = 0; i < 3; i++) {
    const rowStart = i * 3

    const rowSquares = squares.slice(rowStart, rowStart + 3);
      boardRows.push(
        <div key={i} className="board-row">
          {rowSquares.map((value, index) => (
            <Square key={rowStart + index} value={value} isHighlighted={winSquares?.includes(rowStart + index)} onSquareClick={() => handleClick(rowStart + index)} />
          ))}
        </div>
      )

  }

  return (
    <>
    <div className="status">{status}</div>
    {boardRows}
    </>
  )
}

function GameInfo({ history, currentMove, onJump }) {
  const [isAscending, setIsAscending] = useState(true)
  function getMoveDescription(move, history) {
    if (move === 0) return 'Go to game start';

    const currentSquares = history[move];
    const previousSquares = history[move - 1];

    const moveIndex = currentSquares.findIndex(
      (value, idx) => value !== previousSquares[idx]
    );

    const moveRow = Math.floor(moveIndex / 3) + 1;
    const moveCol = (moveIndex % 3) + 1;

    return `Go to move #${move} (${moveRow}, ${moveCol})`;
  }

 let transformedHistory = isAscending ? history : [...history].reverse();
 // You’ll use map to transform your history of moves into React elements representing buttons on the screen
  const moves = transformedHistory.map((squares) => {
    const realMoveIndex = history.indexOf(squares);
    let description = getMoveDescription(realMoveIndex, history);

    return (
      <li key={realMoveIndex}>
      {
        realMoveIndex === currentMove ? (`You are at move #${realMoveIndex}`) : (<button onClick={() => onJump(realMoveIndex)}>{description}</button>)
      }
      </li>
    );
  });

  function sort() {
    setIsAscending(!isAscending)
  }

  return (
    <div>
      <button onClick={() => sort()}>Sort { isAscending ? "↑" : "↓" }</button>
      <ol>{ moves }</ol>
    </div>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

   function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <div className="game-board">
        <GameBoard xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <GameInfo history={history} currentMove={currentMove} onJump={jumpTo} />
      </div>
    </div>
  );
}