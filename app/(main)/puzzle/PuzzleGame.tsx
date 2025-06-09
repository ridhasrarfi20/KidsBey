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
  imageFile: string;
  imageWidth: number;
  imageHeight: number;
  onRestart?: () => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ imageFile, imageWidth, imageHeight, onRestart }) => {
  // ...existing state
  const [touchDragging, setTouchDragging] = React.useState<null | { tile: number; fromTray: boolean }>(null);
  const [touchPosition, setTouchPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [selectedTile, setSelectedTile] = React.useState<number | null>(null);

  // Tap-to-select tray tile
  const handleTrayTileClick = (tile: number) => {
    setSelectedTile(tile === selectedTile ? null : tile);
  };
  // Tap-to-place on board
  const handleBoardCellClick = (idx: number) => {
    if (selectedTile !== null && boardTiles[idx] === null) {
      handleUserInteract();
      // Only allow placing if the piece is correct
      if (selectedTile !== idx) {
        // Play incorrect sound
        if (userHasInteracted) {
          const audio = new window.Audio('/incorrect.mp3');
          audio.currentTime = 0;
          audio.play();
        }
        setSelectedTile(null);
        return;
      }
      // Play correct sound
      if (userHasInteracted) {
        const audio = new window.Audio('/correct.wav');
        audio.currentTime = 0;
        audio.play();
      }
      let newBoard = [...boardTiles];
      let newTray = trayTiles.filter(t => t !== selectedTile);
      const prevIdx = boardTiles.indexOf(selectedTile);
      if (prevIdx !== -1) newBoard[prevIdx] = null;
      newBoard[idx] = selectedTile;
      setBoardTiles(newBoard);
      setTrayTiles(newTray);
      setSelectedTile(null);
    }
  };

  // Helper to get board cell from touch position
  const getBoardCellFromTouch = (clientX: number, clientY: number) => {
    const board = document.getElementById('puzzle-board');
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    if (
      clientX < rect.left || clientX > rect.right ||
      clientY < rect.top || clientY > rect.bottom
    ) return null;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cellWidth = rect.width / GRID_SIZE;
    const cellHeight = rect.height / GRID_SIZE;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const idx = row * GRID_SIZE + col;
    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) return idx;
    return null;
  };

  // Touch event handlers
  const handleTileTouchStart = (tile: number, fromTray: boolean) => (e: React.TouchEvent) => {
    setTouchDragging({ tile, fromTray });
    setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const handleTileTouchMove = (e: React.TouchEvent) => {
    if (!touchDragging) return;
    setTouchPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const handleTileTouchEnd = (e: React.TouchEvent) => {
    if (!touchDragging) return;
    const { tile, fromTray } = touchDragging;
    const { clientX, clientY } = e.changedTouches[0];
    // Try to drop on board
    const boardIdx = getBoardCellFromTouch(clientX, clientY);
    if (boardIdx !== null) {
      handleBoardDrop(boardIdx);
    } else {
      // Drop back to tray
      handleTrayDrop();
    }
    setTouchDragging(null);
    setTouchPosition(null);
  };

  const GRID_SIZE = 5;
  const TILE_COUNT = GRID_SIZE * GRID_SIZE;
  const TILE_WIDTH = Math.round(imageWidth / GRID_SIZE);
  const TILE_HEIGHT = Math.round(imageHeight / GRID_SIZE);
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
    <div
      className="flex flex-col items-center w-full px-2 py-4 sm:px-4 md:px-8 lg:px-12"
      style={{ minHeight: '100vh', background: 'rgba(240,245,255,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={handleUserInteract} onDrag={handleUserInteract}
    >
      {/* Timer Bar */}
      <div className="w-full max-w-2xl flex flex-row flex-wrap justify-between items-center mb-4 gap-2">
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

      {/* Puzzle board */}
      <div
        style={{
          width: '100%',
          maxWidth: '100vw',
          overflow: 'auto',
          margin: '0 auto',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          id="puzzle-board"
          className="grid mb-8 bg-white/60 rounded-xl shadow-lg border border-gray-200"
          style={{
            aspectRatio: `${imageWidth} / ${imageHeight}`,
            width: '100%',
            maxWidth: imageWidth ? `${imageWidth}px` : '100%',
            maxHeight: imageHeight ? `${imageHeight}px` : '100%',
            margin: '0 auto',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            gap: 0,
            overflow: 'hidden',
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
                  border: selectedTile !== null && boardTiles[idx] === null ? '2px dashed #22c55e' : undefined,
                }}
                draggable={tile !== null && !solved}
                onDragStart={tile !== null ? (e) => handleDragStart(tile, e) : undefined}
                onDrop={() => handleBoardDrop(idx)}
                onDragOver={handleDragOver}
                onTouchStart={tile !== null ? handleTileTouchStart(tile, false) : undefined}
                onTouchMove={tile !== null ? handleTileTouchMove : undefined}
                onTouchEnd={tile !== null ? handleTileTouchEnd : undefined}
                onClick={() => handleBoardCellClick(idx)}
              >
                {tile !== null ? (
                  <Image
                    src={`/images/${img || imageFile}`}
                    alt={`tile-${tile}`}
                    width={imageWidth}
                    height={imageHeight}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'none',
                      objectPosition: `${(tile % GRID_SIZE) / (GRID_SIZE - 1) * 100}% ${Math.floor(tile / GRID_SIZE) / (GRID_SIZE - 1) * 100}%`,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      background: '#ddd',
                    }}
                    draggable={false}
                    priority
                  />
                ) : (
                  <Image
                    src={`/images/${img || imageFile}`}
                    alt={`blur-preview-${idx}`}
                    width={imageWidth}
                    height={imageHeight}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'none',
                      objectPosition: `${(col) / (GRID_SIZE - 1) * 100}% ${(row) / (GRID_SIZE - 1) * 100}%`,
                      filter: 'blur(6px)',
                      opacity: 0.5,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                    draggable={false}
                    priority
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Tray tiles */}
      <div
        className="flex flex-row border-t pt-4 mb-8 justify-center items-center flex-nowrap w-full max-w-2xl overflow-x-auto gap-2"
        style={{ minHeight: TILE_HEIGHT }}
        onDrop={handleTrayDrop}
        onDragOver={handleDragOver}
      >
        {trayTiles.map((tile) => (
          <div
            key={tile}
            className={`border bg-gray-200 relative overflow-hidden rounded-md shadow-sm mx-1 flex-shrink-0 ${touchDragging?.tile === tile ? 'ring-4 ring-blue-400' : ''} ${selectedTile === tile ? 'ring-4 ring-green-500' : ''}`}
            style={{
              width: TILE_WIDTH,
              height: TILE_HEIGHT,
              background: '#f8f8f8',
              boxSizing: 'border-box',
            }}
            draggable={!solved}
            onDragStart={(e) => handleDragStart(tile, e) }
            onTouchStart={handleTileTouchStart(tile, true)}
            onTouchMove={handleTileTouchMove}
            onTouchEnd={handleTileTouchEnd}
            onClick={() => handleTrayTileClick(tile)}
          >
            <Image
              src={`/images/${img || imageFile}`}
              alt={`tile-${tile}`}
              width={imageWidth}
              height={imageHeight}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'none',
                objectPosition: `${(tile % GRID_SIZE) / (GRID_SIZE - 1) * 100}% ${Math.floor(tile / GRID_SIZE) / (GRID_SIZE - 1) * 100}%`,
                pointerEvents: 'none',
                userSelect: 'none',
                background: '#ddd',
                border: '1px solid #333',
                boxSizing: 'border-box',
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
