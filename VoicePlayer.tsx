'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Clock
} from 'lucide-react';

interface VoicePlayerProps {
  audioUrl: string;
  duration: number;
  username: string;
  timestamp: number;
  userColor?: string;
}

export default function VoicePlayer({
  audioUrl,
  duration,
  username,
  timestamp,
  userColor = '#3B82F6'
}: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'audio
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadstart = () => setIsLoading(true);
    audio.oncanplay = () => setIsLoading(false);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onvolumechange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    };

    return () => {
      audio.pause();
      audio.removeEventListener('loadstart', () => {});
      audio.removeEventListener('canplay', () => {});
      audio.removeEventListener('play', () => {});
      audio.removeEventListener('pause', () => {});
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('volumechange', () => {});
    };
  }, [audioUrl]);

  // Toggle play/pause
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Erreur lecture audio:', error);
    }
  };

  // Rechercher dans l'audio
  const seekTo = (percentage: number) => {
    if (audioRef.current) {
      const time = (percentage / 100) * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  // Changer la vitesse de lecture
  const changePlaybackRate = () => {
    if (audioRef.current) {
      const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
      const currentIndex = rates.indexOf(playbackRate);
      const nextRate = rates[(currentIndex + 1) % rates.length];

      audioRef.current.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  };

  // Redémarrer
  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Télécharger le fichier
  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `message_vocal_${username}_${new Date(timestamp).getTime()}.webm`;
    link.click();
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcul du pourcentage de progression
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200 max-w-xs">
      {/* Header avec info utilisateur */}
      <div className="flex items-center space-x-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: userColor }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-700">{username}</div>
          <div className="text-xs text-slate-500">
            {new Date(timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          <Volume2 className="w-3 h-3 mr-1" />
          Vocal
        </Badge>
      </div>

      {/* Forme d'onde visuelle simplifiée */}
      <div className="mb-3">
        <div className="flex items-center justify-center h-8 bg-slate-100 rounded-lg relative overflow-hidden">
          {/* Barres représentant la forme d'onde */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 mx-0.5 rounded-full transition-all duration-300 ${
                progressPercentage > (i * 5)
                  ? 'bg-blue-500'
                  : 'bg-slate-300'
              }`}
              style={{
                height: `${Math.random() * 20 + 10}px`,
                animation: isPlaying ? `pulse-wave 1s ease-in-out infinite ${i * 0.1}s` : 'none'
              }}
            />
          ))}

          {/* Overlay de progression cliquable */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = (x / rect.width) * 100;
              seekTo(percentage);
            }}
          />
        </div>
      </div>

      {/* Temps et barre de progression */}
      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatTime(currentTime)}</span>
        </div>
        <div className="flex-1 mx-2">
          <div className="w-full bg-slate-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Contrôles principaux */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {/* Play/Pause */}
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlayback}
            disabled={isLoading}
            className="w-8 h-8 p-0"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          {/* Restart */}
          <Button
            variant="ghost"
            size="sm"
            onClick={restart}
            className="w-8 h-8 p-0"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>

          {/* Volume */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="w-8 h-8 p-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          {/* Vitesse de lecture */}
          <Button
            variant="ghost"
            size="sm"
            onClick={changePlaybackRate}
            className="h-6 text-xs px-2"
          >
            {playbackRate}x
          </Button>

          {/* Télécharger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAudio}
            className="w-8 h-8 p-0"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* CSS pour l'animation des barres */}
      <style jsx>{`
        @keyframes pulse-wave {
          0%, 100% { opacity: 0.7; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
