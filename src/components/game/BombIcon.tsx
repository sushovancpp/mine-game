import { motion } from 'framer-motion';

interface BombIconProps {
  className?: string;
  size?: number;
  exploding?: boolean;
}

export const BombIcon = ({ className = '', size = 32, exploding = true }: BombIconProps) => {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${className} bomb-glow`}
      initial={exploding ? { scale: 0 } : false}
      animate={exploding ? { scale: [0, 1.3, 1] } : false}
      transition={{ duration: 0.4, times: [0, 0.6, 1] }}
    >
      <defs>
        <radialGradient id="bombGradientGreen" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="hsl(140, 25%, 35%)" />
          <stop offset="100%" stopColor="hsl(140, 30%, 15%)" />
        </radialGradient>
        <radialGradient id="explosionGradientGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="40%" stopColor="hsl(140, 40%, 60%)" />
          <stop offset="100%" stopColor="hsl(140, 30%, 30%)" />
        </radialGradient>
        <filter id="bombGlowGreen">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Explosion effect behind bomb */}
      {exploding && (
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0.7], scale: [0.5, 1.2, 1] }}
          transition={{ duration: 0.5 }}
        >
          <circle cx="32" cy="36" r="28" fill="url(#explosionGradientGreen)" opacity="0.4" />
          <circle cx="32" cy="36" r="20" fill="url(#explosionGradientGreen)" opacity="0.6" />
        </motion.g>
      )}
      
      {/* Bomb body */}
      <circle
        cx="32"
        cy="38"
        r="18"
        fill="url(#bombGradientGreen)"
        stroke="hsl(140, 20%, 25%)"
        strokeWidth="1"
        filter="url(#bombGlowGreen)"
      />
      
      {/* Shine on bomb */}
      <ellipse
        cx="26"
        cy="32"
        rx="6"
        ry="8"
        fill="hsl(140, 20%, 45%)"
        opacity="0.4"
      />
      
      {/* Fuse holder */}
      <rect
        x="28"
        y="18"
        width="8"
        height="6"
        rx="1"
        fill="hsl(140, 25%, 25%)"
      />
      
      {/* Fuse */}
      <path
        d="M32 18 Q38 12 34 6"
        stroke="hsl(140, 20%, 35%)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Spark - white with green tint */}
      {exploding && (
        <motion.g
          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <circle cx="34" cy="5" r="4" fill="hsl(140, 60%, 70%)" />
          <circle cx="34" cy="5" r="2" fill="white" />
        </motion.g>
      )}
      
      {/* Skull face on bomb - white highlights */}
      <g opacity="0.8">
        <circle cx="26" cy="38" r="3" fill="white" />
        <circle cx="38" cy="38" r="3" fill="white" />
        <path
          d="M28 46 L30 44 L32 46 L34 44 L36 46"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </motion.svg>
  );
};
