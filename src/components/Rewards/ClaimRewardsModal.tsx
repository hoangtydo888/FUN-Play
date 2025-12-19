import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles, Gift, CheckCircle, Loader2, ExternalLink, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface ClaimRewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RewardBreakdown {
  type: string;
  amount: number;
  count: number;
}

const REWARD_TYPE_LABELS: Record<string, string> = {
  view: "Xem video",
  like: "Thích video",
  comment: "Bình luận",
  share: "Chia sẻ",
  upload: "Upload video",
  first_upload: "Upload đầu tiên",
  signup: "Đăng ký",
  wallet_connect: "Kết nối ví",
};

export const ClaimRewardsModal = ({ open, onOpenChange }: ClaimRewardsModalProps) => {
  const { user } = useAuth();
  const { isConnected, address, connectWallet } = useWalletConnection();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [totalUnclaimed, setTotalUnclaimed] = useState(0);
  const [breakdown, setBreakdown] = useState<RewardBreakdown[]>([]);

  useEffect(() => {
    if (open && user) {
      fetchUnclaimedRewards();
    }
  }, [open, user]);

  const fetchUnclaimedRewards = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: rewards, error } = await supabase
        .from("reward_transactions")
        .select("reward_type, amount")
        .eq("user_id", user.id)
        .eq("claimed", false)
        .eq("status", "success");

      if (error) throw error;

      // Calculate breakdown
      const breakdownMap = new Map<string, { amount: number; count: number }>();
      let total = 0;

      rewards?.forEach((r) => {
        const existing = breakdownMap.get(r.reward_type) || { amount: 0, count: 0 };
        breakdownMap.set(r.reward_type, {
          amount: existing.amount + Number(r.amount),
          count: existing.count + 1,
        });
        total += Number(r.amount);
      });

      setBreakdown(
        Array.from(breakdownMap.entries()).map(([type, data]) => ({
          type,
          ...data,
        }))
      );
      setTotalUnclaimed(total);
    } catch (error) {
      console.error("Error fetching unclaimed rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!user || !isConnected || !address) {
      toast({
        title: "Vui lòng kết nối ví",
        description: "Bạn cần kết nối ví MetaMask để nhận CAMLY",
        variant: "destructive",
      });
      return;
    }

    setClaiming(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("claim-camly", {
        body: { walletAddress: address },
      });

      if (response.error) {
        throw new Error(response.error.message || "Claim failed");
      }

      const data = response.data;

      if (data.success) {
        setClaimSuccess(true);
        setTxHash(data.txHash);

        // Trigger confetti celebration
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#FFD700", "#40E0D0", "#FF69B4", "#00CED1"],
        });

        toast({
          title: "🎉 Rich Rich Rich!",
          description: `${data.amount.toLocaleString()} CAMLY đã được gửi đến ví của bạn!`,
        });
      } else {
        throw new Error(data.error || "Claim failed");
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      toast({
        title: "Lỗi claim",
        description: error.message || "Không thể claim rewards. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gift className="h-6 w-6 text-yellow-500" />
            </motion.div>
            Claim CAMLY Rewards
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : claimSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-cyan-400 flex items-center justify-center"
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
                Rich Rich Rich! 🎉
              </h3>
              
              <p className="text-muted-foreground">
                CAMLY thật đã được gửi đến ví của bạn!
              </p>

              {txHash && (
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Xem giao dịch trên BscScan
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <Button
                onClick={() => {
                  setClaimSuccess(false);
                  setTxHash(null);
                  onOpenChange(false);
                }}
                className="w-full"
              >
                Đóng
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Total Unclaimed */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 via-cyan-500/20 to-yellow-500/20 border border-yellow-500/30"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 215, 0, 0.3)",
                      "0 0 40px rgba(64, 224, 208, 0.3)",
                      "0 0 20px rgba(255, 215, 0, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <div className="relative text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Coins className="h-8 w-8 text-yellow-500" />
                    </motion.div>
                    <span className="text-sm text-muted-foreground">Phần thưởng chờ claim</span>
                  </div>
                  
                  <motion.p
                    className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {formatNumber(totalUnclaimed)}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">CAMLY</p>
                </div>
              </motion.div>

              {/* Breakdown */}
              {breakdown.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Chi tiết phần thưởng</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {breakdown.map((item, index) => (
                      <motion.div
                        key={item.type}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <span className="text-sm">
                          {REWARD_TYPE_LABELS[item.type] || item.type} ({item.count}x)
                        </span>
                        <span className="font-medium text-yellow-500">
                          +{formatNumber(item.amount)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wallet Connection */}
              {!isConnected ? (
                <Button
                  onClick={connectWallet}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Kết nối ví để claim
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <span className="text-muted-foreground">Ví nhận:</span>
                    <p className="font-mono text-xs truncate">{address}</p>
                  </div>

                  <Button
                    onClick={handleClaim}
                    disabled={claiming || totalUnclaimed <= 0}
                    className="w-full bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 text-white font-bold py-6"
                  >
                    {claiming ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Đang gửi CAMLY...
                      </>
                    ) : totalUnclaimed <= 0 ? (
                      "Không có phần thưởng để claim"
                    ) : (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <Coins className="h-5 w-5 mr-2" />
                        </motion.div>
                        Claim {formatNumber(totalUnclaimed)} CAMLY
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Angel hint */}
              <motion.p
                className="text-center text-xs text-muted-foreground italic"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Angel says: "Rich Rich Rich rewards waiting for you!" ✨
              </motion.p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
