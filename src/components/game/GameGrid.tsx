import { motion } from 'framer-motion';
import { GameTile } from './GameTile';
import { Tile, GameState } from '@/hooks/useGameLogic';

interface GameGridProps {
  tiles: Tile[];
  gameState: GameState;
  points: number;
  onTileClick: (id: number) => void;
}

export const GameGrid = ({ tiles, gameState, points, onTileClick }: GameGridProps) => {
  const isGameActive = gameState === 'playing';
  const isGameOver = gameState === 'lost' || gameState === 'won';
  const isLost = gameState === 'lost';

  return (
    <motion.div 
      className="glass-panel p-4 md:p-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: isLost ? [0, -10, 10, -10, 10, -5, 5, 0] : 0
      }}
      transition={{ 
        duration: isLost ? 0.5 : 0.5,
        x: { duration: 0.5, ease: "easeOut" }
      }}
    >
      <motion.div 
        className="grid grid-cols-5 gap-2 md:gap-3 max-w-[400px] mx-auto"
        animate={{
          filter: isGameOver ? 'blur(2px) brightness(0.5)' : 'blur(0px) brightness(1)',
        }}
        transition={{ duration: 0.3, delay: isLost ? 0.3 : 0 }}
      >
        {tiles.map((tile) => (
          <GameTile
            key={tile.id}
            id={tile.id}
            state={tile.state}
            onClick={() => onTileClick(tile.id)}
            disabled={!isGameActive}
          />
        ))}
      </motion.div>

      {/* Game over overlay */}
      {isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isLost ? 0.4 : 0 }}
          className="absolute inset-0 flex items-center justify-center rounded-xl"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              delay: isLost ? 0.5 : 0
            }}
            className="text-center"
          >
            {isLost ? (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: [0, 1, 0.8], scale: [1.5, 1, 1.1] }}
                  transition={{ duration: 0.3 }}
                  className="text-5xl md:text-6xl mb-2"
                >
                  💥
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl md:text-5xl font-bold text-white game-over-glow mb-4"
                >
                  GAME OVER
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-lg text-muted-foreground"
                >
                  You hit a mine!
                </motion.p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-5xl md:text-6xl mb-2"
                >
                  💎
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white neon-text-primary mb-4"
                >
                  YOU WIN!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-primary"
                >
                  Final Score: {points}
                </motion.p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
