import { motion } from 'framer-motion';
import { Difficulty } from '@/hooks/useGameLogic';
import { Shield, Target, Skull } from 'lucide-react';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled: boolean;
}

const difficulties: { value: Difficulty; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: 'easy', 
    label: 'Easy', 
    icon: <Shield className="w-4 h-4" />,
    description: '3-5 mines'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    icon: <Target className="w-4 h-4" />,
    description: '8-10 mines'
  },
  { 
    value: 'hard', 
    label: 'Hard', 
    icon: <Skull className="w-4 h-4" />,
    description: '15-20 mines'
  },
];

export const DifficultySelector = ({ difficulty, onChange, disabled }: DifficultySelectorProps) => {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
        Difficulty
      </h3>
      <div className="flex gap-2">
        {difficulties.map((d) => (
          <motion.button
            key={d.value}
            onClick={() => onChange(d.value)}
            disabled={disabled}
            className={`
              flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg
              transition-all duration-200 border
              ${difficulty === d.value
                ? 'bg-primary/25 border-primary/60 text-primary shadow-[0_0_15px_hsl(140_70%_45%/0.3)]'
                : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-primary/10 hover:border-primary/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            {d.icon}
            <span className="text-sm font-semibold">{d.label}</span>
            <span className="text-[10px] opacity-70">{d.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
