import { motion } from 'framer-motion';

interface DiamondIconProps {
  className?: string;
  animated?: boolean;
  size?: number;
}

export const DiamondIcon = ({ className = '', animated = true, size = 32 }: DiamondIconProps) => {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${className} ${animated ? 'animate-pulse-glow' : 'diamond-glow'}`}
      initial={animated ? { scale: 0, rotate: -180 } : false}
      animate={animated ? { scale: 1, rotate: 0 } : false}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <defs>
        <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
          <stop offset="50%" stopColor="hsl(0, 0%, 95%)" />
          <stop offset="100%" stopColor="hsl(0, 0%, 85%)" />
        </linearGradient>
        <linearGradient id="diamondShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="50%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(140, 70%, 60%)" stopOpacity="0.5" />
        </linearGradient>
        <filter id="greenGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feFlood floodColor="hsl(140, 70%, 50%)" floodOpacity="0.8" result="glowColor" />
          <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow" />
          <feMerge>
            <feMergeNode in="softGlow" />
            <feMergeNode in="softGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Main diamond shape */}
      <polygon
        points="32,4 58,24 32,60 6,24"
        fill="url(#diamondGradient)"
        filter="url(#greenGlow)"
      />
      
      {/* Top facets */}
      <polygon
        points="32,4 44,24 32,32 20,24"
        fill="hsl(0, 0%, 100%)"
        opacity="0.7"
      />
      
      {/* Left facet */}
      <polygon
        points="6,24 20,24 32,32 32,60"
        fill="hsl(0, 0%, 80%)"
        opacity="0.6"
      />
      
      {/* Right facet */}
      <polygon
        points="58,24 44,24 32,32 32,60"
        fill="hsl(0, 0%, 90%)"
        opacity="0.6"
      />
      
      {/* Green glow accent */}
      <polygon
        points="32,4 58,24 32,60 6,24"
        fill="hsl(140, 70%, 50%)"
        opacity="0.15"
      />
      
      {/* Shine effect */}
      <polygon
        points="32,4 40,18 32,24 24,18"
        fill="url(#diamondShine)"
      />
      
      {/* Sparkle */}
      <circle cx="22" cy="16" r="2.5" fill="white" opacity="1" />
      <circle cx="40" cy="20" r="1.5" fill="white" opacity="0.8" />
    </motion.svg>
  );
};
