import { useState } from "react"

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{ value }</button>
}


function GameBoard({ xIsNext, squares, onPlay}) {
  function handleClick(index) {
    if( (squares[index]) || calculateWinner(squares) )return;

    const nextSquares = squares.slice()
     if (xIsNext) {
      nextSquares[index] = "X";
    } else {
      nextSquares[index] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `The winner is ${winner}`
  } else {
    status = `The next player is: ${xIsNext ? 'X' : 'O'}`
  }

  const boardRows = [];

  for (let i = 0; i < 3; i++) {
    const rowStart = i * 3

    const rowSquares = squares.slice(rowStart, rowStart + 3);
      boardRows.push(
        <div key={i} className="board-row">
          {rowSquares.map((value, index) => (
            <Square key={rowStart + index} value={value} onSquareClick={() => handleClick(rowStart + index)} />
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
 function getMoveDescription(move) {
  return move > 0 ? `Go to move #${move}` : 'Go to game start';
 }

 // You’ll use map to transform your history of moves into React elements representing buttons on the screen
  const moves = history.map((squares, move) => {
    let description = getMoveDescription(move);

    return (
      <li key={move}>
      {
        move === currentMove ? (`You are at move #${move}`) : (<button onClick={() => onJump(move)}>{description}</button>)
      }
      </li>
    );
  });

  return (
    <ol>{ moves }</ol>
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