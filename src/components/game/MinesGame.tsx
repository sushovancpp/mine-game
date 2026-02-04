import { motion } from 'framer-motion';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGameSounds } from '@/hooks/useGameSounds';
import { GameGrid } from './GameGrid';
import { Scoreboard } from './Scoreboard';
import { DifficultySelector } from './DifficultySelector';
import { GameControls } from './GameControls';
import { useEffect, useRef } from 'react';

export const MinesGame = () => {
  const {
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
  } = useGameLogic();

  const sounds = useGameSounds();
  const prevGameState = useRef(gameState);
  const prevRevealedCount = useRef(revealedCount);

  // Sound effects based on game state changes
  useEffect(() => {
    // Diamond revealed
    if (revealedCount > prevRevealedCount.current && lastAction === 'safe') {
      sounds.playReveal();
    }
    
    // Mine hit
    if (gameState === 'lost' && prevGameState.current === 'playing') {
      sounds.playExplosion();
    }
    
    // Cash out
    if (gameState === 'won' && prevGameState.current === 'playing') {
      sounds.playCashOut();
      setTimeout(() => sounds.playWin(), 300);
    }

    prevGameState.current = gameState;
    prevRevealedCount.current = revealedCount;
  }, [gameState, revealedCount, lastAction, sounds]);

  const handleTileClick = (id: number) => {
    sounds.playClick();
    revealTile(id);
  };

  const handleStartGame = () => {
    sounds.playClick();
    startGame();
  };

  const handleCashOut = () => {
    cashOut();
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 md:mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold neon-text-primary mb-2">
          Mines Game
        </h1>
        <p className="text-muted-foreground">
          Find diamonds, avoid bombs, earn big points!
        </p>
      </motion.header>

      {/* Main game layout */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_320px] gap-6">
        {/* Game grid */}
        <div className="order-2 md:order-1 relative">
          <GameGrid
            tiles={tiles}
            gameState={gameState}
            points={points}
            onTileClick={handleTileClick}
          />
        </div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="order-1 md:order-2 space-y-4"
        >
          <Scoreboard
            points={points}
            multiplier={multiplier}
            minesCount={minesCount}
            revealedCount={revealedCount}
            safeTilesRemaining={safeTilesRemaining}
            difficulty={difficulty}
            gameState={gameState}
          />

          <DifficultySelector
            difficulty={difficulty}
            onChange={changeDifficulty}
            disabled={gameState === 'playing'}
          />

          <GameControls
            gameState={gameState}
            revealedCount={revealedCount}
            onStartGame={handleStartGame}
          />
        </motion.aside>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
};
