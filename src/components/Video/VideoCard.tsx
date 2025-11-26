import { Play, Volume2, Edit, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface VideoCardProps {
  thumbnail: string;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  videoId: string;
  userId?: string;
  onPlay?: (videoId: string) => void;
}

export const VideoCard = ({
  thumbnail,
  title,
  channel,
  views,
  timestamp,
  videoId,
  userId,
  onPlay,
}: VideoCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isOwner = user?.id === userId;

  const handlePlay = () => {
    if (onPlay) {
      onPlay(videoId);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/studio?tab=content&edit=${videoId}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/watch/${videoId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Đã copy link",
      description: "Link video đã được copy vào clipboard",
    });
  };

  return (
    <Card className="group overflow-hidden glass-card holographic border-2 border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer relative">
      {/* Sparkle effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cosmic-gold rounded-full animate-[sparkle_1s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cosmic-cyan rounded-full animate-[sparkle_1.2s_ease-in-out_infinite_0.2s]" />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-cosmic-magenta rounded-full animate-[sparkle_1.4s_ease-in-out_infinite_0.4s]" />
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-t-lg" onClick={handlePlay}>
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Rainbow halo overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-cyan/20 via-cosmic-purple/20 to-cosmic-magenta/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Play button overlay with divine glow */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Button
            size="icon"
            className="h-16 w-16 rounded-full bg-gradient-to-br from-cosmic-cyan via-cosmic-purple to-cosmic-magenta divine-glow border-2 border-glow-white/50"
          >
            <Play className="h-8 w-8 fill-current text-white" />
          </Button>
        </div>

        {/* Edit button for owner */}
        {isOwner && (
          <Button
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 bg-cosmic-purple/90 hover:bg-cosmic-purple border border-glow-magenta/50 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(122,43,255,0.5)]"
            onClick={handleEdit}
            title="Chỉnh sửa trong Studio"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        {/* Share button with glow */}
        <Button
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-cosmic-gold/90 hover:bg-cosmic-gold border border-glow-gold/50 text-background opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
          onClick={handleShare}
          title="Chia sẻ video"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Info with glassmorphism */}
      <div className="p-4 flex gap-3 bg-gradient-to-b from-transparent to-background/20">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cosmic-cyan via-cosmic-purple to-cosmic-magenta flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(122,43,255,0.4)]">
            {channel[0]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm line-clamp-2 mb-1 text-foreground group-hover:text-cosmic-gold transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground group-hover:text-divine-lavender transition-colors duration-300">{channel}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-cosmic-cyan/80 mt-1 transition-colors duration-300">
            <span>{views}</span>
            <span className="text-cosmic-magenta">•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
