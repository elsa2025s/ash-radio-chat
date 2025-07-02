'use client';

import { useState, useRef, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Upload,
  X,
  Volume2,
  Clock
} from 'lucide-react';

interface VoiceRecorderProps {
  onVoiceMessage: (audioUrl: string, duration: number) => void;
  onClose: () => void;
  maxDuration?: number; // en secondes
}

export default function VoiceRecorder({
  onVoiceMessage,
  onClose,
  maxDuration = 180 // 3 minutes par défaut
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [volume, setVolume] = useState(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialiser l'enregistreur
  useEffect(() => {
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Arrêter le stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Timer pour compter la durée
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          // Arrêter automatiquement si durée max atteinte
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Erreur accès microphone:', error);
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Pause/Resume enregistrement
  const pauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        // Reprendre le timer
        timerRef.current = setInterval(() => {
          setDuration(prev => {
            const newDuration = prev + 1;
            if (newDuration >= maxDuration) {
              stopRecording();
            }
            return newDuration;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  // Lire/Pause audio
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Upload vers Firebase Storage
  const uploadVoiceMessage = async () => {
    if (!audioBlob) return;

    setIsUploading(true);

    try {
      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const filename = `voice_message_${timestamp}.webm`;

      // Référence Firebase Storage
      const audioRef = ref(storage, `audio/voice-messages/${filename}`);

      // Upload
      const snapshot = await uploadBytes(audioRef, audioBlob);

      // Obtenir l'URL de téléchargement
      const downloadUrl = await getDownloadURL(snapshot.ref);

      // Envoyer le message vocal
      onVoiceMessage(downloadUrl, duration);

      // Fermer le composant
      onClose();

    } catch (error) {
      console.error('Erreur upload audio:', error);
      alert('Erreur lors de l\'upload du message vocal');
    } finally {
      setIsUploading(false);
    }
  };

  // Recommencer l'enregistrement
  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcul du pourcentage de durée
  const durationPercentage = (duration / maxDuration) * 100;

  return (
    <Card className="w-80 shadow-lg border-2 border-red-200">
      <CardHeader className="bg-gradient-to-r from-red-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-red-500" />
            <span>Message Vocal</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Indicateur de durée */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-slate-800">
            {formatTime(duration)}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Max: {formatTime(maxDuration)}</span>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                durationPercentage > 90 ? 'bg-red-500' :
                durationPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(durationPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Contrôles d'enregistrement */}
        {!audioBlob && (
          <div className="flex justify-center space-x-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Enregistrer
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className={isPaused ? "bg-green-50" : "bg-yellow-50"}
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>

                <Button
                  onClick={stopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Arrêter
                </Button>
              </>
            )}
          </div>
        )}

        {/* Statut enregistrement */}
        {isRecording && (
          <div className="text-center">
            <Badge
              variant="destructive"
              className="animate-pulse"
            >
              <MicOff className="w-3 h-3 mr-1" />
              {isPaused ? 'En pause' : 'Enregistrement...'}
            </Badge>
          </div>
        )}

        {/* Lecteur audio */}
        {audioUrl && (
          <div className="space-y-3">
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onEnded={() => setIsPlaying(false)}
              onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
            />

            {/* Contrôles lecture */}
            <div className="flex items-center justify-center space-x-2">
              <Button
                onClick={togglePlayback}
                variant="outline"
                className="bg-blue-50"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <Button
                onClick={resetRecording}
                variant="outline"
                size="sm"
              >
                Recommencer
              </Button>
            </div>

            {/* Actions finales */}
            <div className="flex space-x-2">
              <Button
                onClick={uploadVoiceMessage}
                disabled={isUploading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Informations */}
        <div className="text-xs text-slate-500 text-center space-y-1">
          <p>🎤 Qualité: HD (44.1kHz)</p>
          <p>📁 Format: WebM (Opus)</p>
          <p>⏱️ Durée max: {formatTime(maxDuration)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
