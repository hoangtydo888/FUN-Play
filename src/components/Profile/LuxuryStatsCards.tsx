import { motion } from "framer-motion";
import { Users, Video, Eye, MessageSquare, Coins } from "lucide-react";
import { CounterAnimation } from "@/components/Layout/CounterAnimation";

interface LuxuryStatsCardsProps {
  followers: number;
  videos: number;
  totalViews: number;
  comments: number;
  rewardsEarned: number;
}

export const LuxuryStatsCards = ({
  followers,
  videos,
  totalViews,
  comments,
  rewardsEarned,
}: LuxuryStatsCardsProps) => {
  const stats = [
    { icon: Users, label: "Followers", value: followers, color: "from-pink-500 to-rose-500", glow: "#ec4899" },
    { icon: Video, label: "Videos", value: videos, color: "from-violet-500 to-purple-500", glow: "#8b5cf6" },
    { icon: Eye, label: "Total Views", value: totalViews, color: "from-cyan-500 to-blue-500", glow: "#06b6d4" },
    { icon: MessageSquare, label: "Comments", value: comments, color: "from-green-500 to-emerald-500", glow: "#22c55e" },
    { icon: Coins, label: "Rewards", value: rewardsEarned, color: "from-yellow-400 to-amber-500", glow: "#fbbf24", suffix: " CAMLY" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className="relative group"
        >
          <div 
            className="relative overflow-hidden rounded-xl p-3 bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg shadow-purple-200/30"
          >
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
              style={{
                background: `radial-gradient(circle at center, ${stat.glow}22, transparent 70%)`,
              }}
            />

            {/* Icon */}
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                whileHover={{
                  boxShadow: `0 0 15px ${stat.glow}`,
                }}
              >
                <stat.icon className="w-4 h-4 text-white" />
              </motion.div>
              <div className="text-xs text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>

            {/* Value */}
            <div className="text-lg font-bold text-gray-800">
              <CounterAnimation 
                value={stat.value} 
                suffix={stat.suffix}
                duration={1200}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
