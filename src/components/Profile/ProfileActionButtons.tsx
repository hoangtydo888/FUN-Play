import { motion } from "framer-motion";
import { Upload, Share2, Wallet, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProfileActionButtonsProps {
  isKYCVerified: boolean;
  onKYCClick: () => void;
  referralCode: string;
}

export const ProfileActionButtons = ({ 
  isKYCVerified, 
  onKYCClick,
  referralCode,
}: ProfileActionButtonsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const shareReferral = () => {
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied! 🎉",
      description: "Share this link to earn 100,000 CAMLY + 5% lifetime earnings!",
    });
  };

  const buttons = [
    {
      label: "Upload Video",
      icon: Upload,
      onClick: () => navigate('/upload'),
      gradient: "from-violet-500 to-purple-600",
      glow: "#8b5cf6",
    },
    {
      label: "Share Referral",
      icon: Share2,
      onClick: shareReferral,
      gradient: "from-pink-500 to-rose-600",
      glow: "#ec4899",
    },
    {
      label: "Claim Rewards",
      icon: Wallet,
      onClick: () => document.getElementById('reward-zone')?.scrollIntoView({ behavior: 'smooth' }),
      gradient: "from-yellow-400 to-amber-500",
      glow: "#fbbf24",
    },
  ];

  return (
    <div className="space-y-3">
      {/* KYC Button */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          onClick={onKYCClick}
          className={`w-full h-10 font-semibold text-sm ${
            isKYCVerified 
              ? 'bg-green-50 border border-green-300 text-green-600 hover:bg-green-100' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
          }`}
          variant={isKYCVerified ? "outline" : "default"}
        >
          <span className="flex items-center gap-2">
            {isKYCVerified ? (
              <>
                <CheckCircle className="w-4 h-4" />
                KYC Verified
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                KYC Now to Claim Rewards
              </>
            )}
          </span>
        </Button>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((button, index) => (
          <motion.div
            key={button.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={button.onClick}
              className={`w-full h-auto py-3 flex-col gap-1.5 bg-gradient-to-br ${button.gradient} text-white border-0 rounded-lg shadow-md`}
            >
              <button.icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{button.label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
