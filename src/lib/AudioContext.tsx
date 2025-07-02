'use client'

import type React from 'react'
import { createContext, useContext, useReducer, useRef, useEffect } from 'react'

// Types pour l'état audio
interface AudioState {
  welcomeMusic: {
    isPlaying: boolean
    volume: number
    currentTime: number
    duration: number
  }
  liveRadio: {
    isPlaying: boolean
    volume: number
    currentTime: number
    duration: number
  }
  currentSource: 'welcomeMusic' | 'liveRadio' | null
  globalVolume: number
  isMuted: boolean
}

// Types pour les actions
type AudioAction =
  | { type: 'PLAY_WELCOME_MUSIC' }
  | { type: 'PAUSE_WELCOME_MUSIC' }
  | { type: 'PLAY_LIVE_RADIO' }
  | { type: 'PAUSE_LIVE_RADIO' }
  | { type: 'SET_WELCOME_VOLUME'; volume: number }
  | { type: 'SET_LIVE_VOLUME'; volume: number }
  | { type: 'SET_GLOBAL_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'UPDATE_WELCOME_TIME'; currentTime: number; duration: number }
  | { type: 'UPDATE_LIVE_TIME'; currentTime: number; duration: number }
  | { type: 'SWITCH_TO_SOURCE'; source: 'welcomeMusic' | 'liveRadio' | null }

// État initial
const initialState: AudioState = {
  welcomeMusic: {
    isPlaying: false,
    volume: 0.3,
    currentTime: 0,
    duration: 0,
  },
  liveRadio: {
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
  },
  currentSource: null,
  globalVolume: 0.8,
  isMuted: false,
}

// Reducer pour gérer l'état audio
function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'PLAY_WELCOME_MUSIC':
      return {
        ...state,
        welcomeMusic: { ...state.welcomeMusic, isPlaying: true },
        liveRadio: { ...state.liveRadio, isPlaying: false },
        currentSource: 'welcomeMusic',
      }
    case 'PAUSE_WELCOME_MUSIC':
      return {
        ...state,
        welcomeMusic: { ...state.welcomeMusic, isPlaying: false },
        currentSource: state.currentSource === 'welcomeMusic' ? null : state.currentSource,
      }
    case 'PLAY_LIVE_RADIO':
      return {
        ...state,
        liveRadio: { ...state.liveRadio, isPlaying: true },
        welcomeMusic: { ...state.welcomeMusic, isPlaying: false },
        currentSource: 'liveRadio',
      }
    case 'PAUSE_LIVE_RADIO':
      return {
        ...state,
        liveRadio: { ...state.liveRadio, isPlaying: false },
        currentSource: state.currentSource === 'liveRadio' ? null : state.currentSource,
      }
    case 'SET_WELCOME_VOLUME':
      return {
        ...state,
        welcomeMusic: { ...state.welcomeMusic, volume: action.volume },
      }
    case 'SET_LIVE_VOLUME':
      return {
        ...state,
        liveRadio: { ...state.liveRadio, volume: action.volume },
      }
    case 'SET_GLOBAL_VOLUME':
      return {
        ...state,
        globalVolume: action.volume,
      }
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted,
      }
    case 'UPDATE_WELCOME_TIME':
      return {
        ...state,
        welcomeMusic: {
          ...state.welcomeMusic,
          currentTime: action.currentTime,
          duration: action.duration,
        },
      }
    case 'UPDATE_LIVE_TIME':
      return {
        ...state,
        liveRadio: {
          ...state.liveRadio,
          currentTime: action.currentTime,
          duration: action.duration,
        },
      }
    case 'SWITCH_TO_SOURCE':
      return {
        ...state,
        currentSource: action.source,
        welcomeMusic: {
          ...state.welcomeMusic,
          isPlaying: action.source === 'welcomeMusic',
        },
        liveRadio: {
          ...state.liveRadio,
          isPlaying: action.source === 'liveRadio',
        },
      }
    default:
      return state
  }
}

// Interface du contexte
interface AudioContextType {
  state: AudioState
  dispatch: React.Dispatch<AudioAction>
  welcomeMusicRef: React.RefObject<HTMLAudioElement>
  liveRadioRef: React.RefObject<HTMLAudioElement>
  playWelcomeMusic: () => void
  pauseWelcomeMusic: () => void
  playLiveRadio: () => void
  pauseLiveRadio: () => void
  setWelcomeVolume: (volume: number) => void
  setLiveVolume: (volume: number) => void
  setGlobalVolume: (volume: number) => void
  toggleMute: () => void
  switchToSource: (source: 'welcomeMusic' | 'liveRadio' | null) => void
}

// Création du contexte
const AudioContext = createContext<AudioContextType | undefined>(undefined)

// Hook pour utiliser le contexte
export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

// Provider du contexte audio
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, initialState)
  const welcomeMusicRef = useRef<HTMLAudioElement>(null)
  const liveRadioRef = useRef<HTMLAudioElement>(null)

  // Fonctions d'action
  const playWelcomeMusic = () => {
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.play()
      dispatch({ type: 'PLAY_WELCOME_MUSIC' })
    }
  }

  const pauseWelcomeMusic = () => {
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.pause()
      dispatch({ type: 'PAUSE_WELCOME_MUSIC' })
    }
  }

  const playLiveRadio = () => {
    if (liveRadioRef.current) {
      liveRadioRef.current.play()
      dispatch({ type: 'PLAY_LIVE_RADIO' })
    }
  }

  const pauseLiveRadio = () => {
    if (liveRadioRef.current) {
      liveRadioRef.current.pause()
      dispatch({ type: 'PAUSE_LIVE_RADIO' })
    }
  }

  const setWelcomeVolume = (volume: number) => {
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.volume = volume
      dispatch({ type: 'SET_WELCOME_VOLUME', volume })
    }
  }

  const setLiveVolume = (volume: number) => {
    if (liveRadioRef.current) {
      liveRadioRef.current.volume = volume
      dispatch({ type: 'SET_LIVE_VOLUME', volume })
    }
  }

  const setGlobalVolume = (volume: number) => {
    dispatch({ type: 'SET_GLOBAL_VOLUME', volume })
    // Appliquer le volume global aux sources audio
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.volume = state.welcomeMusic.volume * volume
    }
    if (liveRadioRef.current) {
      liveRadioRef.current.volume = state.liveRadio.volume * volume
    }
  }

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' })
    const isMuted = !state.isMuted
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.muted = isMuted
    }
    if (liveRadioRef.current) {
      liveRadioRef.current.muted = isMuted
    }
  }

  const switchToSource = (source: 'welcomeMusic' | 'liveRadio' | null) => {
    // Pause toutes les sources
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.pause()
    }
    if (liveRadioRef.current) {
      liveRadioRef.current.pause()
    }

    // Démarrer la nouvelle source
    if (source === 'welcomeMusic' && welcomeMusicRef.current) {
      welcomeMusicRef.current.play()
    } else if (source === 'liveRadio' && liveRadioRef.current) {
      liveRadioRef.current.play()
    }

    dispatch({ type: 'SWITCH_TO_SOURCE', source })
  }

  // Initialisation des éléments audio
  useEffect(() => {
    // Musique d'accueil (fichier audio d'ambiance depuis les assets)
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.src = 'https://ext.same-assets.com/3147506062/181273826.mpga'
      welcomeMusicRef.current.loop = true
      welcomeMusicRef.current.volume = state.welcomeMusic.volume * state.globalVolume
    }

    // URL du flux radio en direct
    if (liveRadioRef.current) {
      liveRadioRef.current.src = 'https://ext.same-assets.com/3147506062/181273826.mpga'
      liveRadioRef.current.loop = true
      liveRadioRef.current.volume = state.liveRadio.volume * state.globalVolume
    }
  }, [])

  // Gestionnaires d'événements pour la musique d'accueil
  useEffect(() => {
    const welcomeMusic = welcomeMusicRef.current
    if (!welcomeMusic) return

    const updateWelcomeTime = () => {
      dispatch({
        type: 'UPDATE_WELCOME_TIME',
        currentTime: welcomeMusic.currentTime,
        duration: welcomeMusic.duration || 0,
      })
    }

    const handleWelcomePlay = () => dispatch({ type: 'PLAY_WELCOME_MUSIC' })
    const handleWelcomePause = () => dispatch({ type: 'PAUSE_WELCOME_MUSIC' })

    welcomeMusic.addEventListener('timeupdate', updateWelcomeTime)
    welcomeMusic.addEventListener('loadedmetadata', updateWelcomeTime)
    welcomeMusic.addEventListener('play', handleWelcomePlay)
    welcomeMusic.addEventListener('pause', handleWelcomePause)

    return () => {
      welcomeMusic.removeEventListener('timeupdate', updateWelcomeTime)
      welcomeMusic.removeEventListener('loadedmetadata', updateWelcomeTime)
      welcomeMusic.removeEventListener('play', handleWelcomePlay)
      welcomeMusic.removeEventListener('pause', handleWelcomePause)
    }
  }, [])

  // Gestionnaires d'événements pour la radio en direct
  useEffect(() => {
    const liveRadio = liveRadioRef.current
    if (!liveRadio) return

    const updateLiveTime = () => {
      dispatch({
        type: 'UPDATE_LIVE_TIME',
        currentTime: liveRadio.currentTime,
        duration: liveRadio.duration || 0,
      })
    }

    const handleLivePlay = () => dispatch({ type: 'PLAY_LIVE_RADIO' })
    const handleLivePause = () => dispatch({ type: 'PAUSE_LIVE_RADIO' })

    liveRadio.addEventListener('timeupdate', updateLiveTime)
    liveRadio.addEventListener('loadedmetadata', updateLiveTime)
    liveRadio.addEventListener('play', handleLivePlay)
    liveRadio.addEventListener('pause', handleLivePause)

    return () => {
      liveRadio.removeEventListener('timeupdate', updateLiveTime)
      liveRadio.removeEventListener('loadedmetadata', updateLiveTime)
      liveRadio.removeEventListener('play', handleLivePlay)
      liveRadio.removeEventListener('pause', handleLivePause)
    }
  }, [])

  // Application du volume global et mute
  useEffect(() => {
    if (welcomeMusicRef.current) {
      welcomeMusicRef.current.volume = state.welcomeMusic.volume * state.globalVolume
      welcomeMusicRef.current.muted = state.isMuted
    }
    if (liveRadioRef.current) {
      liveRadioRef.current.volume = state.liveRadio.volume * state.globalVolume
      liveRadioRef.current.muted = state.isMuted
    }
  }, [state.globalVolume, state.isMuted, state.welcomeMusic.volume, state.liveRadio.volume])

  const contextValue: AudioContextType = {
    state,
    dispatch,
    welcomeMusicRef,
    liveRadioRef,
    playWelcomeMusic,
    pauseWelcomeMusic,
    playLiveRadio,
    pauseLiveRadio,
    setWelcomeVolume,
    setLiveVolume,
    setGlobalVolume,
    toggleMute,
    switchToSource,
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      {/* Éléments audio cachés */}
      <audio
        ref={welcomeMusicRef}
        preload="metadata"
        style={{ display: 'none' }}
      />
      <audio
        ref={liveRadioRef}
        preload="metadata"
        style={{ display: 'none' }}
      />
    </AudioContext.Provider>
  )
}
