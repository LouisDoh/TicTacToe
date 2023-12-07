import { useState } from 'react';

function Square({ whatClass, value, onSquareClick }) {
  return (
    <button
      className={whatClass}
      onClick={onSquareClick}
    >
        {value}
    </button>
)}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if(squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    let toSet;
    xIsNext ? toSet = 'X' : toSet = 'O';
    nextSquares[i] = toSet;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let toRender = [];

  for(let i = 0; i < 3; i++) {
    let currentRowOfTiles = [];
    for(let tile = 0; tile < 3; tile++) {
      let nameOfClass = "square";
      if(winner && winner.includes( (i*3)+tile )) {
        nameOfClass = "winSquare";
      }
      currentRowOfTiles.push(<Square whatClass={nameOfClass} value={squares[(i*3)+tile]} onSquareClick={() => handleClick((i*3)+tile)}/>);
    }
    toRender.push(<div className="board-row">{currentRowOfTiles}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {toRender}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [reverseMoves, setReverseMoves] = useState(false);
  const [moveIndexes, setMoveIndexes] = useState([Array(0)]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1),nextSquares];
    let moveIndex = findMove(history[history.length-1],nextSquares);
    let nextMoveIndexes = [...moveIndexes.slice(0,currentMove+1),moveIndex];
    setMoveIndexes(nextMoveIndexes);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }
  
  function findMove(squaresBefore,squaresAfter) {
    let moveIndex;
    for(let i = 0; i < squaresBefore.length; i++) {
      if(squaresBefore[i] !== squaresAfter[i]) {
        moveIndex = i;
      }
    }
    return moveIndex;
  }

  function reverseClick() {
    setReverseMoves(!reverseMoves);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {
    let description;
    let moveRow = Math.floor(moveIndexes[move]/3) +1;
    let moveCol = (moveIndexes[move]%3)+1;
    let coOrdsString;
    if(move === 0) {
      coOrdsString = "";
    } else {
      coOrdsString = ` (${moveCol},${moveRow})`;
    }
    if (move === currentMove) {
      return (
        <li key={move}>
          <p>You are on move #{currentMove+coOrdsString}</p>
        </li>
      )
    }
    if (move > 0) {
      description = `Go to move #${move}`+coOrdsString;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  
  if(reverseMoves) {
    moves = moves.toReversed();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={reverseClick}>Reverse move order</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],a,b,c];
    }
  }
  return null;
}