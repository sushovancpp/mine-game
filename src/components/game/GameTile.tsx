import { motion } from 'framer-motion';
import { DiamondIcon } from './DiamondIcon';
import { BombIcon } from './BombIcon';
import { TileState } from '@/hooks/useGameLogic';

interface GameTileProps {
  id: number;
  state: TileState;
  onClick: () => void;
  disabled: boolean;
}

export const GameTile = ({ id, state, onClick, disabled }: GameTileProps) => {
  const isHidden = state === 'hidden';
  const isSafe = state === 'safe';
  const isMine = state === 'mine';
  const isRevealedMine = state === 'revealed-mine';

  const getTileClass = () => {
    if (isHidden) return 'tile-hidden cursor-pointer';
    if (isSafe) return 'tile-safe';
    if (isMine || isRevealedMine) return 'tile-mine';
    return '';
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || !isHidden}
      className={`
        aspect-square rounded-lg flex items-center justify-center
        transition-all duration-200 relative overflow-hidden
        ${getTileClass()}
        ${disabled && isHidden ? 'opacity-60 cursor-not-allowed' : ''}
      `}
      whileHover={isHidden && !disabled ? { scale: 1.05 } : {}}
      whileTap={isHidden && !disabled ? { scale: 0.95 } : {}}
      layout
    >
      {/* Hidden state - blank/closed tile */}
      {isHidden && (
        <div className="w-full h-full" />
      )}

      {/* Safe state - show glowing diamond */}
      {isSafe && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <DiamondIcon size={36} animated={true} />
        </motion.div>
      )}

      {/* Mine state - show bomb with explosion */}
      {isMine && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="animate-shake"
        >
          <BombIcon size={36} exploding={true} />
        </motion.div>
      )}

      {/* Revealed mine (after game over) - show static bomb */}
      {isRevealedMine && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 0.1 }}
        >
          <BombIcon size={32} exploding={false} />
        </motion.div>
      )}

      {/* Hover glow effect */}
      {isHidden && !disabled && (
        <div className="absolute inset-0 bg-primary/0 hover:bg-primary/5 transition-colors duration-200 rounded-lg" />
      )}
    </motion.button>
  );
};
