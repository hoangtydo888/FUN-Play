import { motion } from "framer-motion";
import { Upload, Eye, MessageSquare, Users, Coins, TrendingUp } from "lucide-react";
import { CounterAnimation } from "@/components/Layout/CounterAnimation";

interface EarningMechanicsProps {
  uploadRewards: number;
  viewRewards: number;
  commentRewards: number;
  referralRewards: number;
  referralCount: number;
}

export const EarningMechanics = ({
  uploadRewards,
  viewRewards,
  commentRewards,
  referralRewards,
  referralCount,
}: EarningMechanicsProps) => {
  const earnings = [
    {
      icon: Upload,
      title: "Upload Video",
      description: "+100,000 CAMLY when video reaches 3+ views",
      earned: uploadRewards,
      color: "from-violet-500 to-purple-600",
      glow: "#8b5cf6",
    },
    {
      icon: Eye,
      title: "Video Views",
      description: "+50,000 CAMLY per 10 real views",
      earned: viewRewards,
      color: "from-cyan-500 to-blue-600",
      glow: "#06b6d4",
    },
    {
      icon: MessageSquare,
      title: "Comments Received",
      description: "+5,000 CAMLY per comment on your videos",
      earned: commentRewards,
      color: "from-green-500 to-emerald-600",
      glow: "#22c55e",
    },
    {
      icon: Users,
      title: "Referral Income",
      description: `${referralCount} referrals • 5% lifetime earnings from each`,
      earned: referralRewards,
      color: "from-pink-500 to-rose-600",
      glow: "#ec4899",
      isReferral: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="text-lg font-bold text-gray-800">
        Earning Breakdown
      </h3>

      <div className="grid gap-2">
        {earnings.map((earning, index) => (
          <motion.div
            key={earning.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01, x: 3 }}
            className="relative overflow-hidden rounded-lg p-3 bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm"
          >
            {/* Accent left border */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg"
              style={{ background: earning.glow }}
            />

            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${earning.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <earning.icon className="w-4 h-4 text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm">{earning.title}</div>
                <div className="text-xs text-gray-500 truncate">{earning.description}</div>
              </div>

              {/* Earned amount */}
              <div className="text-right">
                <div className="text-base font-bold text-amber-600">
                  +<CounterAnimation value={earning.earned} duration={800} />
                </div>
                <div className="text-xs text-gray-400">CAMLY</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total summary */}
      <motion.div
        className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-gray-800 text-sm">Total Earnings</span>
          </div>
          <div className="text-lg font-bold text-amber-600">
            <CounterAnimation 
              value={uploadRewards + viewRewards + commentRewards + referralRewards} 
              duration={1200} 
            /> CAMLY
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
