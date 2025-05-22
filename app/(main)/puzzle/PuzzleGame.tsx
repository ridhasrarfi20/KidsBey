"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// List of image filenames in /public/images directory
// IMAGE_FILE is now passed as a prop

const IMAGE_WIDTH = 614; // px
const IMAGE_HEIGHT = 413; // px

const GRID_SIZE = 5;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

// Each tile's width and height (not necessarily square)
const TILE_WIDTH = Math.round(IMAGE_WIDTH / GRID_SIZE);  // 123
const TILE_HEIGHT = Math.round(IMAGE_HEIGHT / GRID_SIZE); // 83

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isSolvable(tiles: number[]): boolean {
  let invCount = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) invCount++;
    }
  }
  return invCount % 2 === 0;
}

function isSolved(tiles: (number | null)[]): boolean {
  return tiles.every((tile, idx) => tile === idx);
}

const PUZZLE_TIME_LIMIT = 5 * 60; // 5 minutes in seconds

interface PuzzleGameProps {
  imageFile?: string;
  onRestart?: () => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ imageFile = "1.jpg", onRestart }) => {
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [img, setImg] = useState<string | null>(imageFile);
  const [boardTiles, setBoardTiles] = useState<(number | null)[]>(Array(TILE_COUNT).fill(null));
  const [trayTiles, setTrayTiles] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(PUZZLE_TIME_LIMIT);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    setImg(imageFile);
    setBoardTiles(Array(TILE_COUNT).fill(null));
    setTrayTiles(shuffleArray(Array.from({ length: TILE_COUNT }, (_, i) => i)));
    setSolved(false);
    setDraggedTile(null);
    setTimeLeft(PUZZLE_TIME_LIMIT);
    setTimeUp(false);
  }, [imageFile]);

  useEffect(() => {
    setSolved(boardTiles.every((tile, idx) => tile === idx));
  }, [boardTiles]);

  // Timer effect
  useEffect(() => {
    if (solved || timeUp) return;
    if (timeLeft <= 0) {
      setTimeUp(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [solved, timeLeft, timeUp]);

  // Play lose sound when time is up and not solved
  useEffect(() => {
    if (timeUp && !solved && userHasInteracted) {
      const audio = new window.Audio('/lose.mp3');
      audio.currentTime = 0;
      audio.play();
    }
  }, [timeUp, solved, userHasInteracted]);

  // Play win sound when solved (and not time up)
  useEffect(() => {
    if (solved && !timeUp && userHasInteracted) {
      const audio = new window.Audio('/win.mp3');
      audio.currentTime = 0;
      audio.play();
    }
  }, [solved, timeUp, userHasInteracted]);

  const restart = () => {
    setBoardTiles(Array(TILE_COUNT).fill(null));
    setTrayTiles(shuffleArray(Array.from({ length: TILE_COUNT }, (_, i) => i)));
    setSolved(false);
    setImg(imageFile);
    setDraggedTile(null);
    setTimeLeft(PUZZLE_TIME_LIMIT);
    setTimeUp(false);
    if (onRestart) onRestart();
  };

  const handleUserInteract = () => {
    if (!userHasInteracted) setUserHasInteracted(true);
  };

  const handleDragStart = (tile: number, e?: React.DragEvent) => {
    handleUserInteract();
    setDraggedTile(tile);
    if (e) {
      // Find the color for this piece (match palette logic)
      const idx = boardTiles.indexOf(tile) !== -1 ? boardTiles.indexOf(tile) : trayTiles.indexOf(tile);
      const palette = [
        '#f44336', '#e57373', '#fbc02d', '#fff176', '#388e3c', '#81c784', '#1976d2', '#64b5f6',
        '#8bc34a', '#aed581', '#ff9800', '#ffb74d', '#8d6e63', '#bcaaa4', '#ba68c8', '#ce93d8',
        '#00bcd4', '#4dd0e1', '#cddc39', '#d4e157', '#e91e63', '#f06292', '#9e9e9e', '#bdbdbd', '#ffd600'
      ];
      const color = palette[idx % palette.length];
      // Piece shape
      const row = Math.floor(tile / GRID_SIZE);
      const col = tile % GRID_SIZE;
      const tabs = [] as any; // Will use the same logic as in render
      // Recreate piece shape for drag image
      // For simplicity, use a square with color and white outline
      const dragSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      dragSvg.setAttribute('width', TILE_WIDTH.toString());
      dragSvg.setAttribute('height', TILE_HEIGHT.toString());
      dragSvg.style.background = 'transparent';
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      path.setAttribute('x', '0');
      path.setAttribute('y', '0');
      path.setAttribute('width', TILE_WIDTH.toString());
      path.setAttribute('height', TILE_HEIGHT.toString());
      path.setAttribute('fill', color);
      path.setAttribute('stroke', '#fff');
      path.setAttribute('stroke-width', '6');
      dragSvg.appendChild(path);
      // Render SVG to image
      const svgData = new XMLSerializer().serializeToString(dragSvg);
      const img = new window.Image();
      img.src = 'data:image/svg+xml;base64,' + window.btoa(svgData);
      img.onload = function() {
        e.dataTransfer.setDragImage(img, TILE_WIDTH/2, TILE_HEIGHT/2);
      };
    }
  };

  const handleBoardDrop = (idx: number) => {
    handleUserInteract();
    if (draggedTile === null || boardTiles[idx] !== null) return;
    // Only allow placing if the piece is correct
    if (draggedTile !== idx) {
      // Play incorrect sound
      if (userHasInteracted) {
        const audio = new window.Audio('/incorrect.mp3');
        audio.currentTime = 0;
        audio.play();
      }
      // Wrong place: do nothing (piece stays in tray)
      setDraggedTile(null);
      return;
    }
    // Play correct sound
    if (userHasInteracted) {
      const audio = new window.Audio('/correct.wav');
      audio.currentTime = 0;
      audio.play();
    }

    let newBoard = [...boardTiles];
    let newTray = trayTiles.filter(t => t !== draggedTile);
    const prevIdx = boardTiles.indexOf(draggedTile);
    if (prevIdx !== -1) newBoard[prevIdx] = null;
    newBoard[idx] = draggedTile;
    setBoardTiles(newBoard);
    setTrayTiles(newTray);
    setDraggedTile(null);
  };

  const handleTrayDrop = () => {
    handleUserInteract();
    if (draggedTile === null) return;
    let newBoard = [...boardTiles];
    const prevIdx = boardTiles.indexOf(draggedTile);
    if (prevIdx !== -1) newBoard[prevIdx] = null;
    let newTray = trayTiles.includes(draggedTile) ? trayTiles : [...trayTiles, draggedTile];
    setBoardTiles(newBoard);
    setTrayTiles(newTray);
    setDraggedTile(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Calculate progress
  const correctCount = boardTiles.filter((tile, idx) => tile === idx).length;
  const progress = correctCount / TILE_COUNT;

  // Format time mm:ss
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center p-6" onClick={handleUserInteract} onDrag={handleUserInteract} >
      {/* Timer Bar */}
      <div className="w-full max-w-[620px] flex flex-row justify-between items-center mb-4">
        <div className="text-lg font-bold tracking-widest text-blue-800">
          Temps restant: <span className={timeLeft <= 10 ? 'text-red-600' : ''}>{timeString}</span>
        </div>
        <button
          className="px-4 py-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-700 transition"
          onClick={restart}
        >
          Rejouer
        </button>
        {onRestart && (
          <button
            className="ml-2 px-4 py-1 rounded bg-gray-400 text-white font-semibold hover:bg-gray-600 transition"
            onClick={onRestart}
          >
            Retour a la gallerie
          </button>
        )}
      </div>
      {solved && !timeUp && (
        <div className="w-full max-w-[620px] text-center text-3xl font-bold text-green-600 mb-4 animate-bounce">
          🎉 felicitation tu as resolu le puzzle 🎉
        </div>
      )}
      {timeUp && !solved && (
        <div className="w-full max-w-[620px] text-center text-2xl font-bold text-red-600 mb-4 animate-pulse">
          temps écoulé , reessaye !
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full max-w-[620px] h-4 bg-gray-300 rounded-full mb-6 overflow-hidden shadow-inner">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
     

      {/* Puzzle board */}
      <div
        className="grid mb-8"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_WIDTH}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${TILE_HEIGHT}px)`,
          gap: 0,
        }}
      >
        {boardTiles.map((tile, idx) => {
          const row = Math.floor(idx / GRID_SIZE);
          const col = idx % GRID_SIZE;
          const showBlur = tile === null;
          return (
            <div
              key={idx}
              style={{
                width: TILE_WIDTH,
                height: TILE_HEIGHT,
                background: 'transparent',
                boxSizing: 'border-box',
              }}
              draggable={tile !== null && !solved}
              onDragStart={tile !== null ? (e) => handleDragStart(tile, e) : undefined}
              onDrop={() => handleBoardDrop(idx)}
              onDragOver={handleDragOver}
            >
              {(() => {
                if (tile !== null) {
                  return (
                    <>
                      <Image
                        src={`/images/${img || imageFile}`}
                        alt={`tile-${tile}`}
                        width={IMAGE_WIDTH}
                        height={IMAGE_HEIGHT}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "none",
                          objectPosition: `-${(tile % GRID_SIZE) * TILE_WIDTH}px -${Math.floor(tile / GRID_SIZE) * TILE_HEIGHT}px`,
                          pointerEvents: "none",
                          userSelect: "none",
                          background: '#ddd',
                        }}
                        draggable={false}
                        priority
                      />
                      
                    </>
                  );
                } else if (showBlur) {
                  return (
                    <Image
                      src={`/images/${img || imageFile}`}
                      alt={`blur-preview-${idx}`}
                      width={IMAGE_WIDTH}
                      height={IMAGE_HEIGHT}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "none",
                        objectPosition: `-${col * TILE_WIDTH}px -${row * TILE_HEIGHT}px`,
                        filter: "blur(6px)",
                        opacity: 0.5,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                      draggable={false}
                      priority
                    />
                  );
                } else {
                  return null;
                }
              })()}
            </div>
          );
        })}
      </div>

      {/* Tray */}
      <div
        className="flex flex-row border-t pt-4 mb-8 justify-center items-center flex-wrap"
        style={{ gap: 2, minHeight: TILE_HEIGHT }}
        onDrop={handleTrayDrop}
        onDragOver={handleDragOver}
      >
        {trayTiles.map((tile) => (
          <div
            key={tile}
            className="border bg-gray-200 relative overflow-hidden"
            style={{
              width: TILE_WIDTH,
              height: TILE_HEIGHT,
              background: '#f8f8f8',
              boxSizing: 'border-box',
            }}
            draggable={!solved}
            onDragStart={(e) => handleDragStart(tile, e) }
          >
            <Image
              src={`/images/${img || imageFile}`}
              alt={`tile-${tile}`}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "none",
                objectPosition: `-${(tile % GRID_SIZE) * TILE_WIDTH}px -${Math.floor(tile / GRID_SIZE) * TILE_HEIGHT}px`,
                pointerEvents: "none",
                userSelect: "none",
                background: '#ddd',
                border: '1px solid #333',
              }}
              draggable={false}
              priority
            />
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleGame;
