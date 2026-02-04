import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { GameState } from '@/hooks/useGameLogic';

interface GameControlsProps {
  gameState: GameState;
  revealedCount: number;
  onStartGame: () => void;
}

export const GameControls = ({
  gameState,
  revealedCount,
  onStartGame,
}: GameControlsProps) => {
  const isIdle = gameState === 'idle';
  const isPlaying = gameState === 'playing';
  const isGameOver = gameState === 'lost' || gameState === 'won';

  return (
    <div className="glass-panel p-4 space-y-3">
      {/* Start / Restart Button */}
      <motion.button
        onClick={onStartGame}
        className={`
          w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider
          flex items-center justify-center gap-2
          ${isIdle || isGameOver ? 'btn-primary-glow' : 'bg-muted/50 text-muted-foreground'}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isIdle ? (
          <>
            <Play className="w-5 h-5" />
            Start Game
          </>
        ) : isGameOver ? (
          <>
            <RotateCcw className="w-5 h-5" />
            Play Again
          </>
        ) : (
          <>
            <RotateCcw className="w-5 h-5" />
            Restart
          </>
        )}
      </motion.button>

      {/* Help text */}
      <p className="text-center text-xs text-muted-foreground">
        {isIdle && 'Select difficulty and start the game'}
        {isPlaying && revealedCount === 0 && 'Click a tile to reveal'}
        {isPlaying && revealedCount > 0 && 'Keep revealing diamonds!'}
        {gameState === 'lost' && 'Better luck next time!'}
        {gameState === 'won' && 'Great job! Play again?'}
      </p>
    </div>
  );
};
