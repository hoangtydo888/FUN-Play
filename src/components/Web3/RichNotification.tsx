import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RichNotificationProps {
  show: boolean;
  amount: string;
  token: string;
  onClose: () => void;
}

export const RichNotification = ({ show, amount, token, onClose }: RichNotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-24 right-4 z-50 glass-card p-6 rounded-2xl shadow-2xl border-2 border-golden/30"
          style={{
            background: "rgba(10, 14, 44, 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                textShadow: [
                  "0 0 10px #FFD700",
                  "0 0 30px #FFD700, 0 0 50px #FFD700",
                  "0 0 10px #FFD700",
                ],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-[#FFD700] font-black text-4xl"
              style={{
                textShadow: "0 0 20px #FFD700, 0 0 40px #FFD700",
              }}
            >
              Rich
            </motion.span>
            <motion.span
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-red-500 font-bold text-3xl"
              style={{
                textShadow: "0 0 10px #FF0000, 0 0 20px #FF0000",
              }}
            >
              +{amount} {token}
            </motion.span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-golden mt-2"
          >
            💰 Bạn vừa nhận được tiền!
          </motion.p>
          
          {/* Sparkle effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                className="absolute w-2 h-2 bg-golden rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: "0 0 10px #FFD700",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
