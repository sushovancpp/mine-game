import { useState, useCallback, useMemo } from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type TileState = 'hidden' | 'safe' | 'mine' | 'revealed-mine';
export type GameState = 'idle' | 'playing' | 'won' | 'lost';

export interface Tile {
  id: number;
  state: TileState;
  isMine: boolean;
}

interface DifficultyConfig {
  minMines: number;
  maxMines: number;
  baseMultiplier: number;
  multiplierIncrement: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { minMines: 3, maxMines: 5, baseMultiplier: 1.0, multiplierIncrement: 0.12 },
  medium: { minMines: 8, maxMines: 10, baseMultiplier: 1.0, multiplierIncrement: 0.25 },
  hard: { minMines: 15, maxMines: 20, baseMultiplier: 1.0, multiplierIncrement: 0.5 },
};

const GRID_SIZE = 25;

export const useGameLogic = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [tiles, setTiles] = useState<Tile[]>(() => initializeTiles());
  const [gameState, setGameState] = useState<GameState>('idle');
  const [points, setPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [minesCount, setMinesCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [lastAction, setLastAction] = useState<'safe' | 'mine' | null>(null);

  function initializeTiles(): Tile[] {
    return Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      state: 'hidden',
      isMine: false,
    }));
  }

  function generateMines(difficulty: Difficulty): Set<number> {
    const config = DIFFICULTY_CONFIG[difficulty];
    const mineCount = Math.floor(
      Math.random() * (config.maxMines - config.minMines + 1) + config.minMines
    );
    const minePositions = new Set<number>();

    while (minePositions.size < mineCount) {
      minePositions.add(Math.floor(Math.random() * GRID_SIZE));
    }

    return minePositions;
  }

  const startGame = useCallback(() => {
    const minePositions = generateMines(difficulty);
    const config = DIFFICULTY_CONFIG[difficulty];
    
    const newTiles = Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      state: 'hidden' as TileState,
      isMine: minePositions.has(i),
    }));

    setTiles(newTiles);
    setMinesCount(minePositions.size);
    setGameState('playing');
    setPoints(0);
    setMultiplier(config.baseMultiplier);
    setRevealedCount(0);
    setLastAction(null);
  }, [difficulty]);

  const revealTile = useCallback((tileId: number) => {
    if (gameState !== 'playing') return;

    setTiles(prevTiles => {
      const tile = prevTiles[tileId];
      if (tile.state !== 'hidden') return prevTiles;

      const newTiles = [...prevTiles];
      
      if (tile.isMine) {
        // Hit a mine - game over
        newTiles[tileId] = { ...tile, state: 'mine' };
        // Reveal all mines
        newTiles.forEach((t, i) => {
          if (t.isMine && t.state === 'hidden') {
            newTiles[i] = { ...t, state: 'revealed-mine' };
          }
        });
        
        setGameState('lost');
        setPoints(0);
        setLastAction('mine');
      } else {
        // Safe tile
        newTiles[tileId] = { ...tile, state: 'safe' };
        const config = DIFFICULTY_CONFIG[difficulty];
        
        setRevealedCount(prev => {
          const newCount = prev + 1;
          const safeTiles = GRID_SIZE - minesCount;
          
          // Check if all safe tiles are revealed
          if (newCount >= safeTiles) {
            setGameState('won');
          }
          return newCount;
        });
        
        setMultiplier(prev => {
          const newMultiplier = parseFloat((prev + config.multiplierIncrement).toFixed(2));
          setPoints(p => Math.floor(p + 100 * newMultiplier));
          return newMultiplier;
        });
        
        setLastAction('safe');
      }

      return newTiles;
    });
  }, [gameState, difficulty, minesCount]);

  const cashOut = useCallback(() => {
    if (gameState !== 'playing' || revealedCount === 0) return;
    setGameState('won');
  }, [gameState, revealedCount]);

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setTiles(initializeTiles());
    setGameState('idle');
    setPoints(0);
    setMultiplier(1.0);
    setMinesCount(0);
    setRevealedCount(0);
    setLastAction(null);
  }, []);

  const safeTilesRemaining = useMemo(() => {
    return GRID_SIZE - minesCount - revealedCount;
  }, [minesCount, revealedCount]);

  return {
    tiles,
    difficulty,
    gameState,
    points,
    multiplier,
    minesCount,
    revealedCount,
    safeTilesRemaining,
    lastAction,
    startGame,
    revealTile,
    cashOut,
    changeDifficulty,
  };
};
