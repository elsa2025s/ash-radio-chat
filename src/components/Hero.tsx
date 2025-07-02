"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Heart, Share2, SkipBack, SkipForward, Volume2, Radio, Music, Pause } from "lucide-react"
import { useAudio } from "@/lib/AudioContext"
import Image from "next/image"

export function Hero() {
  const { state, switchToSource, playWelcomeMusic, pauseWelcomeMusic, playLiveRadio } = useAudio()
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-black/40" />
        {/* Microphone background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&h=800&fit=crop')"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo and title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold ash-text-gradient">
              ASH-RADIO
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Musique des années 80 à 2000
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <Badge variant="secondary" className="ash-gradient text-white font-semibold px-4 py-2">
              EN DIRECT
            </Badge>
          </div>

          {/* Current playing */}
          <Card className="max-w-md mx-auto glass-effect border-white/20">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Image
                  src="https://ext.same-assets.com/3147506062/4097153619.jpeg"
                  alt="Album cover"
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Titre de la chanson</h3>
                  <p className="text-sm text-muted-foreground">Artiste - Album (2000)</p>
                </div>
              </div>

              {/* Player controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button size="sm" variant="ghost" className="text-white hover:text-primary">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button size="lg" className="ash-gradient rounded-full w-12 h-12">
                  <Play className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-primary">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button size="sm" variant="ghost" className="text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  J'aime
                </Button>
                <Button size="sm" variant="ghost" className="text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <Button size="sm" variant="ghost" className="text-white">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="ash-gradient"
              onClick={() => {
                if (state.currentSource === 'liveRadio') {
                  switchToSource('welcomeMusic')
                } else {
                  if (state.welcomeMusic.isPlaying) {
                    pauseWelcomeMusic()
                  } else {
                    playWelcomeMusic()
                  }
                }
              }}
            >
              {state.currentSource === 'liveRadio' ? (
                <>
                  <Music className="w-5 h-5 mr-2" />
                  Musique d'Accueil
                </>
              ) : (
                <>
                  {state.welcomeMusic.isPlaying ? (
                    <Pause className="w-5 h-5 mr-2" />
                  ) : (
                    <Play className="w-5 h-5 mr-2" />
                  )}
                  {state.welcomeMusic.isPlaying ? "Pause" : "Play"} Musique
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => switchToSource('liveRadio')}
            >
              <Radio className="w-5 h-5 mr-2" />
              {state.currentSource === 'liveRadio' ? "En Direct ●" : "Écouter en Direct"}
            </Button>
          </div>
        </div>
      </div>

      {/* Animated elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-6 border-2 border-white/50 rounded-full border-t-transparent animate-spin" />
      </div>
    </section>
  )
}
