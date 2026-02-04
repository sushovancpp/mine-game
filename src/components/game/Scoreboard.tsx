import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Bomb, TrendingUp, Coins } from 'lucide-react';
import { Difficulty, GameState } from '@/hooks/useGameLogic';

interface ScoreboardProps {
  points: number;
  multiplier: number;
  minesCount: number;
  revealedCount: number;
  safeTilesRemaining: number;
  difficulty: Difficulty;
  gameState: GameState;
}

export const Scoreboard = ({
  points,
  multiplier,
  minesCount,
  revealedCount,
  safeTilesRemaining,
  difficulty,
  gameState,
}: ScoreboardProps) => {
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const difficultyClass = `difficulty-${difficulty}`;

  return (
    <div className="glass-panel p-4 space-y-4">
      {/* Title and difficulty */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold neon-text-primary">MINES</h2>
        <span className={`difficulty-badge ${difficultyClass}`}>
          {difficultyLabel}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Points */}
        <motion.div 
          className="bg-muted/30 rounded-lg p-3 text-center"
          animate={points > 0 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Coins className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Points</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={points}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-2xl font-bold neon-text-gold"
            >
              {points.toLocaleString()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Multiplier */}
        <motion.div 
          className="bg-muted/30 rounded-lg p-3 text-center"
          animate={multiplier > 1 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Multiplier</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={multiplier}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="text-2xl font-bold neon-text-primary"
            >
              {multiplier.toFixed(2)}x
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Mines */}
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Bomb className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Mines</span>
          </div>
          <div className="text-2xl font-bold text-destructive">
            {gameState === 'idle' ? '?' : minesCount}
          </div>
        </div>

        {/* Diamonds Found */}
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Gem className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Found</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {revealedCount}
          </div>
        </div>
      </div>

      {/* Safe tiles remaining */}
      {gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-success/10 border border-success/20 rounded-lg p-2 text-center"
        >
          <span className="text-xs text-success">
            {safeTilesRemaining} safe tiles remaining
          </span>
        </motion.div>
      )}

      {/* Game state message */}
      {gameState === 'lost' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 text-center"
        >
          <span className="text-destructive font-semibold">💥 You hit a mine!</span>
        </motion.div>
      )}

      {gameState === 'won' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-success/20 border border-success/30 rounded-lg p-3 text-center"
        >
          <span className="text-success font-semibold">
            🎉 Cashed out with {points.toLocaleString()} points!
          </span>
        </motion.div>
      )}
    </div>
  );
};
