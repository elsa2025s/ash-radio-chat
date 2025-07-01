'use client';

import { useState, useRef, useEffect } from 'react';
import { useFirebaseChat } from '@/hooks/useFirebaseChat';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import AuthModal from "@/components/AuthModal";
import EmojiPicker from "@/components/EmojiPicker";
import ImageUpload from "@/components/ImageUpload";
import VoiceRecorder from "@/components/VoiceRecorder";
import VoicePlayer from "@/components/VoicePlayer";
import ModerationPanel from "@/components/ModerationPanel";
import RoleBadge from "@/components/RoleBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Circle,
  Crown,
  Hash,
  ImageIcon,
  Music,
  Radio,
  Send,
  Settings,
  Shield,
  Smile,
  Users,
  Volume2,
  Mic
} from "lucide-react";

export default function ChatClientComponent() {
  const { user, isAuthenticated, logout } = useFirebaseAuth();
  const {
    connected,
    messages,
    users,
    channels,
    currentChannel,
    typingUsers,
    sendMessage,
    sendVoiceMessage,
    joinChannel,
    startTyping,
    stopTyping,
    moderateUser,
    getCurrentChannelInfo,
    getTypingUsernames
  } = useFirebaseChat(user);

  // États locaux
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Afficher la modal d'auth si pas connecté
  if (!isAuthenticated || !user) {
    return <AuthModal />;
  }

  // Afficher loading si pas connecté à Firebase
  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2" />
          <p className="text-slate-600">Connexion à Ash-Radio Firebase...</p>
        </div>
      </div>
    );
  }

  // Obtenir les informations du channel actuel
  const channelInfo = getCurrentChannelInfo();
  const typingUsernames = getTypingUsernames();

  // Gestion de l'envoi de message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage('');
      setIsTyping(false);
      stopTyping();
    }
  };

  // Gestion de la saisie
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      startTyping();
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
      stopTyping();
    }
  };

  // Gestion de l'envoi avec Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gestion du changement de channel
  const handleChannelChange = (channelId: string) => {
    if (channelId !== currentChannel) {
      setIsTyping(false);
      stopTyping();
      joinChannel(channelId);
    }
  };

  // Gestion des emojis
  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (imageUrl: string) => {
    sendMessage(`Image partagée: ${imageUrl}`, 'image', imageUrl);
    setShowImageUpload(false);
  };

  // Gestion des messages vocaux
  const handleVoiceMessage = (audioUrl: string, duration: number) => {
    sendVoiceMessage(audioUrl, duration);
    setShowVoiceRecorder(false);
  };

  // Formatage de l'heure
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour obtenir l'icône du channel
  const getChannelIcon = (channelId: string) => {
    switch(channelId) {
      case 'general': return <Hash className="w-4 h-4" />;
      case 'musique': return <Music className="w-4 h-4" />;
      case 'radio': return <Radio className="w-4 h-4" />;
      case 'vocal': return <Volume2 className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans text-sm overflow-hidden bg-gradient-to-br from-red-50 to-purple-50 text-slate-800 transition-colors duration-300">
      {/* Audio elements */}
      <audio preload="auto">
        <source
          src="https://ext.same-assets.com/2104236545/2000908109.mpga"
          type="audio/mpeg"
        />
      </audio>
      <audio preload="auto">
        <source
          src="https://ext.same-assets.com/2104236545/451126872.mpga"
          type="audio/mpeg"
        />
      </audio>

      {/* Sidebar gauche - Channels */}
      <div className="bg-slate-900 text-white w-full md:w-60 md:min-w-60 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-white">Ash-Radio</h1>
              <p className="text-xs text-slate-300">Firebase + Vocal</p>
            </div>
          </div>

          {/* Statut en direct */}
          <div className="mt-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-red-700">EN DIRECT</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Messages vocaux activés ! 🎤
              </p>
            </div>
          </div>
        </div>

        {/* Liste des channels */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Channels
          </h3>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelChange(channel.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-left transition-colors ${
                  currentChannel === channel.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div style={{ color: channel.color }}>
                  {getChannelIcon(channel.id)}
                </div>
                <span className="text-sm">{channel.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs bg-slate-600 text-slate-200">
                  {channel.memberCount}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* User info en bas */}
        <div className="absolute bottom-0 left-0 right-0 md:relative p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: user.color }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-white truncate">
                  {user.username}
                </span>
                <RoleBadge role={user.role} />
              </div>
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                <span className="text-xs text-slate-400">🎤 Vocal</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-400 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Zone principale - Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header du channel */}
        <div className="bg-white border-b border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div style={{ color: channelInfo?.color || '#3B82F6' }}>
                {getChannelIcon(currentChannel)}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">
                  {channelInfo?.name || '#general'}
                </h2>
                <p className="text-xs text-slate-500">
                  {channelInfo?.topic || 'Bienvenue sur Ash-Radio Firebase !'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-slate-600">
                {users.length} {users.length > 1 ? 'utilisateurs' : 'utilisateur'}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                🎤 Messages vocaux
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="group">
                {message.type === 'system' ? (
                  <div className="text-center">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {message.content}
                    </span>
                  </div>
                ) : message.type === 'voice' ? (
                  // Message vocal
                  <div className="flex space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: users.find(u => u.id === message.userId)?.color || '#3B82F6' }}
                    >
                      {message.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-slate-900">
                          {message.username}
                        </span>
                        {message.userRole && (
                          <RoleBadge role={message.userRole} />
                        )}
                        <span className="text-xs text-slate-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <VoicePlayer
                        audioUrl={message.audioUrl || ''}
                        duration={message.duration || 0}
                        username={message.username}
                        timestamp={message.timestamp}
                        userColor={users.find(u => u.id === message.userId)?.color}
                      />
                    </div>
                  </div>
                ) : (
                  // Message texte/image normal
                  <div className="flex space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: users.find(u => u.id === message.userId)?.color || '#3B82F6' }}
                    >
                      {message.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-900">
                          {message.username}
                        </span>
                        {message.userRole && (
                          <RoleBadge role={message.userRole} />
                        )}
                        <span className="text-xs text-slate-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="text-slate-700">
                        {message.type === 'image' ? (
                          <div>
                            <p className="mb-2">{message.content}</p>
                            {message.imageUrl && (
                              <img
                                src={message.imageUrl}
                                alt="Image partagée"
                                className="max-w-sm rounded-lg border"
                              />
                            )}
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Indicateur de saisie */}
            {typingUsernames.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="text-xs text-slate-500 italic flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                    <div
                      className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span>
                    {typingUsernames.length === 1
                      ? `${typingUsernames[0]} est en train d'écrire...`
                      : `${typingUsernames.length} personnes sont en train d'écrire...`
                    }
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Zone de saisie */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${channelInfo?.name || '#general'}`}
                className="pr-32"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-6 w-6 p-0"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="h-6 w-6 p-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                  title="Message vocal"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 left-4 z-50">
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}

          {/* Image Upload */}
          {showImageUpload && (
            <div className="absolute bottom-20 left-4 z-50">
              <ImageUpload
                onImageUpload={handleImageUpload}
                onClose={() => setShowImageUpload(false)}
              />
            </div>
          )}

          {/* Voice Recorder */}
          {showVoiceRecorder && (
            <div className="absolute bottom-20 left-4 z-50">
              <VoiceRecorder
                onVoiceMessage={handleVoiceMessage}
                onClose={() => setShowVoiceRecorder(false)}
                maxDuration={180}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar droite - Utilisateurs */}
      <div className="bg-white w-full md:w-64 md:min-w-64 border-l border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>
              Utilisateurs ({users.length})
            </span>
          </h3>
        </div>

        <ScrollArea className="h-full p-4">
          <div className="space-y-2">
            {users.map((chatUser) => (
              <div
                key={chatUser.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group"
                onClick={() => {
                  if (user.role === 'admin' || (user.role === 'moderator' && chatUser.role === 'user')) {
                    setSelectedUser(chatUser.id);
                    setShowModerationPanel(true);
                  }
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: chatUser.color }}
                >
                  {chatUser.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {chatUser.username}
                    </span>
                    <RoleBadge role={chatUser.role} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    <span className="text-xs text-slate-500">En ligne</span>
                    <Mic className="w-3 h-3 text-red-500" title="Peut envoyer des messages vocaux" />
                  </div>
                </div>
                {(user.role === 'admin' || (user.role === 'moderator' && chatUser.role === 'user')) && (
                  <Shield className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Panel de modération */}
      {showModerationPanel && selectedUser && (
        <ModerationPanel
          targetUserId={selectedUser}
          targetUsername={users.find(u => u.id === selectedUser)?.username || ''}
          currentUserRole={user.role}
          onModerate={moderateUser}
          onClose={() => {
            setShowModerationPanel(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
