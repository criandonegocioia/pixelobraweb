import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface PhoneMockupProps {
    videoSrc: string;
    poster?: string;
    frameColorClassName?: string;
}

export default function PhoneMockup({ videoSrc, poster, frameColorClassName }: PhoneMockupProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showPoster, setShowPoster] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
                setShowPoster(false);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVideoEnd = () => {
        setIsPlaying(false);
        setShowPoster(true); // Show poster when video ends
        if (videoRef.current) {
            videoRef.current.currentTime = 0; // Reset to start
        }
    };

    const restartVideo = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
            setShowPoster(false);
        }
    };

    return (
        <div className="relative mx-auto w-full max-w-[300px] aspect-[9/19]">
            {/* Phone Frame */}
            <div className={`absolute inset-0 bg-black rounded-[2.5rem] border-[8px] ${frameColorClassName || 'border-gray-800'} shadow-xl overflow-hidden ring-1 ring-white/10`}>
                {/* Notch/Dynamic Island area */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-20"></div>

                {/* Video Container */}
                <div
                    className="relative w-full h-full bg-gray-900 cursor-pointer group"
                    onClick={togglePlay}
                >
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        poster={poster}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${showPoster ? 'opacity-0' : 'opacity-100'}`}
                        playsInline
                        muted={isMuted}
                        onEnded={handleVideoEnd}
                    />

                    {/* Poster Image Overlay (to ensure it shows when we want it to) */}
                    {showPoster && poster && (
                        <div className="absolute inset-0">
                            <img src={poster} alt="Video poster" className="w-full h-full object-cover" />
                            {/* Play button overlay on poster */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls Overlay (only when video is active) */}
                    {!showPoster && (
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                            <motion.div
                                initial={false}
                                animate={{ scale: isPlaying ? 0.8 : 1 }}
                                className="bg-white/20 backdrop-blur-md p-4 rounded-full"
                            >
                                {isPlaying ? (
                                    <Pause className="w-8 h-8 text-white fill-current" />
                                ) : (
                                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                                )}
                            </motion.div>
                        </div>
                    )}

                    {/* Left Controls - Restart */}
                    <button
                        onClick={restartVideo}
                        className="absolute bottom-6 left-4 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors z-10"
                        title="Reiniciar"
                    >
                        <RotateCcw size={20} />
                    </button>

                    {/* Right Controls - Mute */}
                    <button
                        onClick={toggleMute}
                        className="absolute bottom-6 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors z-10"
                        title={isMuted ? "Ativar som" : "Silenciar"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Reflection/Shine effect */}
            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/5 pointer-events-none z-30"></div>
        </div>
    );
}
