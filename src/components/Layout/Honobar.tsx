import { Users, Video, Eye, MessageSquare, Coins, UserPlus } from "lucide-react";
import { useHonobarStats } from "@/hooks/useHonobarStats";
import { CounterAnimation } from "./CounterAnimation";
import { motion } from "framer-motion";

export const Honobar = () => {
  const { stats, loading } = useHonobarStats();

  const statItems = [
    {
      icon: Users,
      label: "Tổng người dùng",
      labelEn: "Total Users",
      value: stats.totalUsers,
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: Video,
      label: "Tổng video",
      labelEn: "Total Videos",
      value: stats.totalVideos,
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Eye,
      label: "Lượt xem",
      labelEn: "Total Views",
      value: stats.totalViews,
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: MessageSquare,
      label: "Bình luận",
      labelEn: "Total Comments",
      value: stats.totalComments,
      color: "from-orange-400 to-red-400",
    },
    {
      icon: Coins,
      label: "Phần thưởng đã phát",
      labelEn: "Total Rewards",
      value: stats.totalRewards,
      color: "from-yellow-400 to-amber-400",
      decimals: 3,
      isCrypto: true,
    },
    {
      icon: UserPlus,
      label: "Đăng ký kênh",
      labelEn: "Channel Subs",
      value: stats.totalSubscriptions,
      color: "from-indigo-400 to-violet-400",
    },
  ];

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-2 md:px-4 py-1.5 md:py-2">
          <div className="flex items-center gap-1 md:gap-2 overflow-x-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted/30 rounded-md h-12 w-20 flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
    >
      <div className="container mx-auto px-2 md:px-4 py-1.5 md:py-2">
        <div className="flex items-center justify-between gap-1 md:gap-2 overflow-x-auto">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.labelEn}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative group flex-shrink-0"
              >
                <div className="relative overflow-hidden rounded-md bg-black/80 backdrop-blur-sm border border-border/30 px-2 py-1 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br ${item.color} bg-clip-text text-transparent flex-shrink-0`} />
                    <div className="flex flex-col items-start min-w-0">
                      <div className="text-[8px] md:text-[9px] text-muted-foreground/70 font-medium whitespace-nowrap leading-tight">
                        {item.label}
                      </div>
                      <div className={`text-xs md:text-sm font-bold bg-gradient-to-br ${item.color} bg-clip-text text-transparent tabular-nums leading-tight`}>
                        <CounterAnimation 
                          value={item.value} 
                          decimals={item.decimals || 0}
                        />
                        {item.isCrypto && <span className="text-[8px] ml-0.5">tk</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
