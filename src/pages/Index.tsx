import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { VideoCard } from "@/components/Video/VideoCard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Mock video data
  const videos = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    thumbnail: `https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=225&fit=crop`,
    title: `Amazing Music Performance ${i + 1} - Live Concert Highlights`,
    channel: `Music Channel ${i + 1}`,
    views: `${Math.floor(Math.random() * 900 + 100)}K views`,
    timestamp: `${Math.floor(Math.random() * 12 + 1)} days ago`,
  }));

  const handleTip = () => {
    toast({
      title: "Tip Creator",
      description: "Connect your wallet to send tips to creators",
    });
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main content */}
      <main className="pt-14 lg:pl-64">
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                thumbnail={video.thumbnail}
                title={video.title}
                channel={video.channel}
                views={video.views}
                timestamp={video.timestamp}
                onTip={handleTip}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
