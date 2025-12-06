import { motion } from "framer-motion";
import { Medal, Award, Crown, Gem, Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

interface LuxuryHonobarProps {
  totalRewards: number;
  previousTotal?: number;
}

const ACHIEVEMENT_TIERS = [
  { name: "Bronze", threshold: 1_000_000, icon: Medal, color: "from-amber-700 via-orange-500 to-amber-600", glow: "#cd7f32", shadowColor: "rgba(205,127,50,0.6)" },
  { name: "Silver", threshold: 3_000_000, icon: Award, color: "from-slate-300 via-gray-100 to-slate-400", glow: "#c0c0c0", shadowColor: "rgba(192,192,192,0.6)" },
  { name: "Gold", threshold: 5_000_000, icon: Crown, color: "from-yellow-300 via-amber-400 to-yellow-500", glow: "#ffd700", shadowColor: "rgba(255,215,0,0.6)" },
  { name: "Diamond", threshold: 10_000_000, icon: Gem, color: "from-cyan-200 via-blue-300 to-purple-300", glow: "#00e7ff", shadowColor: "rgba(0,231,255,0.6)" },
];

export const LuxuryHonobar = ({ totalRewards, previousTotal = 0 }: LuxuryHonobarProps) => {
  const hasTriggeredRankUp = useRef(false);

  const currentTier = [...ACHIEVEMENT_TIERS].reverse().find(t => totalRewards >= t.threshold);
  const nextTier = ACHIEVEMENT_TIERS.find(t => totalRewards < t.threshold);
  
  const prevTier = [...ACHIEVEMENT_TIERS].reverse().find(t => previousTotal >= t.threshold);

  useEffect(() => {
    if (currentTier && prevTier && currentTier.threshold > prevTier.threshold && !hasTriggeredRankUp.current) {
      hasTriggeredRankUp.current = true;
      triggerRankUpCelebration();
    }
  }, [currentTier, prevTier]);

  const triggerRankUpCelebration = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});

    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ffd700', '#ff00e5', '#00e7ff', '#7a2bff', '#cd7f32', '#c0c0c0'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.8 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors,
      });
    }, 500);
  };

  const progress = nextTier 
    ? ((totalRewards - (currentTier?.threshold || 0)) / (nextTier.threshold - (currentTier?.threshold || 0))) * 100
    : 100;

  const TierIcon = currentTier?.icon || Medal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-amber-200/30"
    >
      {/* Golden accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex items-center gap-4">
          {/* Current tier icon */}
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${currentTier?.color || 'from-gray-400 to-gray-500'} shadow-md`}
            whileHover={{ scale: 1.05 }}
          >
            <TierIcon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Tier info */}
          <div className="flex-1">
            <div 
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currentTier?.name || 'Newbie'}
            </div>
            <div className="text-xs text-gray-500">Achievement Badge</div>
          </div>

          {/* Progress to next tier */}
          {nextTier && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Next: {nextTier.name}</div>
              <div className="text-sm font-bold text-purple-600">
                {((nextTier.threshold - totalRewards) / 1_000_000).toFixed(1)}M
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {nextTier && (
          <div className="mt-3">
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${currentTier?.glow || '#888'}, ${nextTier.glow})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>{(totalRewards / 1_000_000).toFixed(1)}M</span>
              <span>{(nextTier.threshold / 1_000_000).toFixed(0)}M</span>
            </div>
          </div>
        )}

        {/* Tier badges */}
        <div className="flex justify-center gap-3 mt-3">
          {ACHIEVEMENT_TIERS.map((tier) => {
            const isUnlocked = totalRewards >= tier.threshold;
            const isCurrent = currentTier?.name === tier.name;
            const Icon = tier.icon;
            
            return (
              <motion.div
                key={tier.name}
                className="relative"
                whileHover={{ scale: 1.1 }}
              >
                <div 
                  className={`p-2 rounded-lg ${isUnlocked ? `bg-gradient-to-br ${tier.color}` : 'bg-gray-200'} shadow-sm`}
                >
                  <Icon className={`w-5 h-5 ${isUnlocked ? 'text-white' : 'text-gray-400'}`} />
                </div>
                {isCurrent && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
