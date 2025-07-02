'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useAudio } from '@/lib/AudioContext'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  Music,
  Minimize2,
  Maximize2,
  SkipBack,
  SkipForward
} from 'lucide-react'

export default function GlobalAudioPlayer() {
  const {
    state,
    playWelcomeMusic,
    pauseWelcomeMusic,
    playLiveRadio,
    pauseLiveRadio,
    setGlobalVolume,
    toggleMute,
    switchToSource
  } = useAudio()

  const [isMinimized, setIsMinimized] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)

  // Format du temps en MM:SS
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Gestion des contrôles de lecture
  const handlePlayPause = () => {
    if (state.currentSource === 'welcomeMusic') {
      if (state.welcomeMusic.isPlaying) {
        pauseWelcomeMusic()
      } else {
        playWelcomeMusic()
      }
    } else if (state.currentSource === 'liveRadio') {
      if (state.liveRadio.isPlaying) {
        pauseLiveRadio()
      } else {
        playLiveRadio()
      }
    } else {
      // Aucune source active, démarrer la musique d'accueil par défaut
      switchToSource('welcomeMusic')
    }
  }

  const handleSourceSwitch = (source: 'welcomeMusic' | 'liveRadio') => {
    switchToSource(source)
  }

  const currentTrack = state.currentSource === 'liveRadio'
    ? {
        title: 'ASH Radio Live',
        artist: 'En direct',
        isLive: true,
        currentTime: 0,
        duration: 0,
      }
    : {
        title: 'Musique d\'ambiance',
        artist: 'ASH Radio',
        isLive: false,
        currentTime: state.welcomeMusic.currentTime,
        duration: state.welcomeMusic.duration,
      }

  const isPlaying = state.currentSource === 'welcomeMusic'
    ? state.welcomeMusic.isPlaying
    : state.currentSource === 'liveRadio'
    ? state.liveRadio.isPlaying
    : false

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full ash-gradient shadow-2xl hover:opacity-90 transition-all duration-200 hover:scale-110"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10">
      <Card className="rounded-none border-0 bg-transparent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">

            {/* Informations sur la piste */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {/* Artwork/Icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-black flex items-center justify-center flex-shrink-0">
                {state.currentSource === 'liveRadio' ? (
                  <Radio className="w-6 h-6 text-white" />
                ) : (
                  <Music className="w-6 h-6 text-white" />
                )}
              </div>

              {/* Infos track */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white text-sm truncate">
                    {currentTrack.title}
                  </h4>
                  {currentTrack.isLive && (
                    <Badge className="bg-red-500 text-white text-xs animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 text-xs truncate">
                  {currentTrack.artist}
                </p>

                {/* Barre de progression (uniquement pour la musique d'accueil) */}
                {!currentTrack.isLive && currentTrack.duration > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-400 w-10">
                      {formatTime(currentTrack.currentTime)}
                    </span>
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full ash-gradient transition-all duration-100"
                        style={{
                          width: `${(currentTrack.currentTime / currentTrack.duration) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10">
                      {formatTime(currentTrack.duration)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contrôles de lecture */}
            <div className="flex items-center gap-2">

              {/* Bouton source précédente */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSourceSwitch('welcomeMusic')}
                className={`text-white hover:bg-white/10 transition-colors ${
                  state.currentSource === 'welcomeMusic' ? 'bg-white/20' : ''
                }`}
                disabled={state.currentSource === 'welcomeMusic'}
              >
                <Music className="w-4 h-4" />
              </Button>

              {/* Bouton Play/Pause principal */}
              <Button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full ash-gradient hover:opacity-90 transition-opacity"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </Button>

              {/* Bouton source suivante */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSourceSwitch('liveRadio')}
                className={`text-white hover:bg-white/10 transition-colors ${
                  state.currentSource === 'liveRadio' ? 'bg-white/20' : ''
                }`}
                disabled={state.currentSource === 'liveRadio'}
              >
                <Radio className="w-4 h-4" />
              </Button>
            </div>

            {/* Contrôles de volume */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVolumeControl(!showVolumeControl)}
                  onMouseEnter={() => setShowVolumeControl(true)}
                  className="text-white hover:bg-white/10"
                >
                  {state.isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>

                {/* Slider de volume */}
                {showVolumeControl && (
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 w-32"
                    onMouseLeave={() => setShowVolumeControl(false)}
                  >
                    <div className="flex items-center gap-2">
                      <VolumeX className="w-3 h-3 text-gray-400" />
                      <Slider
                        value={[state.globalVolume * 100]}
                        onValueChange={(value) => setGlobalVolume(value[0] / 100)}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Volume2 className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="text-center text-xs text-gray-400 mt-1">
                      {Math.round(state.globalVolume * 100)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Mute */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/10"
              >
                {state.isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              {/* Bouton minimiser */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/10"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sélecteur de source en mode mobile */}
          <div className="sm:hidden mt-3 flex gap-2">
            <Button
              variant={state.currentSource === 'welcomeMusic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSourceSwitch('welcomeMusic')}
              className={`flex-1 ${
                state.currentSource === 'welcomeMusic'
                  ? 'ash-gradient text-white'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Music className="w-4 h-4 mr-2" />
              Ambiance
            </Button>
            <Button
              variant={state.currentSource === 'liveRadio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSourceSwitch('liveRadio')}
              className={`flex-1 ${
                state.currentSource === 'liveRadio'
                  ? 'ash-gradient text-white'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Radio className="w-4 h-4 mr-2" />
              Live Radio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
