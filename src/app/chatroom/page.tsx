"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Send, Heart, Users, Mic, Gift, Music } from "lucide-react"

export default function ChatroomPage() {
  const [message, setMessage] = useState("")

  const onlineUsers = [
    { name: "Ashley", role: "Animateur", avatar: "https://ext.same-assets.com/3147506062/1283814652.jpeg", status: "live" },
    { name: "MusicLover80", role: "VIP", avatar: null, status: "online" },
    { name: "RetroFan95", role: "Membre", avatar: null, status: "online" },
    { name: "DanceQueen", role: "Modérateur", avatar: null, status: "online" },
    { name: "PopLover2000", role: "Membre", avatar: null, status: "online" },
    { name: "VinylCollector", role: "VIP", avatar: null, status: "away" },
    { name: "RadioAddict", role: "Membre", avatar: null, status: "online" },
    { name: "SynthWave", role: "Membre", avatar: null, status: "online" }
  ]

  const messages = [
    { user: "Ashley", role: "Animateur", message: "Salut tout le monde ! Prêts pour une soirée rétro ? 🎵", time: "21:42", type: "host" },
    { user: "MusicLover80", role: "VIP", message: "Salut Ashley ! J'adore ton émission 😍", time: "21:43", type: "member" },
    { user: "RetroFan95", role: "Membre", message: "Peux-tu jouer du Duran Duran ce soir ?", time: "21:43", type: "request" },
    { user: "DanceQueen", role: "Modérateur", message: "Excellent choix ! 'Hungry Like the Wolf' serait parfait", time: "21:44", type: "moderator" },
    { user: "PopLover2000", role: "Membre", message: "Cette chanson me rappelle ma jeunesse ❤️", time: "21:45", type: "member" },
    { user: "Ashley", role: "Animateur", message: "Excellente demande ! Je la programme pour dans 10 minutes", time: "21:45", type: "host" },
    { user: "VinylCollector", role: "VIP", message: "Ashley, tu as une version originale vinyl de ce titre ?", time: "21:46", type: "member" },
    { user: "RadioAddict", role: "Membre", message: "Le son est parfait ce soir, bravo à l'équipe technique !", time: "21:47", type: "member" },
    { user: "SynthWave", role: "Membre", message: "🎹🎵 Cette ambiance synthwave me transporte !", time: "21:48", type: "member" },
    { user: "MusicLover80", role: "VIP", message: "Quelqu'un connaît le nom de cette chanson qui passe maintenant ?", time: "21:49", type: "member" }
  ]

  const sendMessage = () => {
    if (message.trim()) {
      // Ici on enverrait le message
      setMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            CHATROOM
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discutez en direct avec les animateurs et la communauté ASH Radio
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Chat principal */}
          <div className="lg:col-span-3">
            <div className="glass-effect rounded-lg border border-white/10 h-[600px] flex flex-col">
              {/* Header du chat */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <h2 className="font-bold">Chat en Direct</h2>
                    <Badge className="ash-gradient text-white">
                      {onlineUsers.length} en ligne
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Music className="w-4 h-4 mr-2" />
                      Demander un titre
                    </Button>
                    <Button size="sm" variant="outline">
                      <Gift className="w-4 h-4 mr-2" />
                      Soutenir
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      msg.type === 'host' ? 'ash-gradient text-white' :
                      msg.type === 'moderator' ? 'bg-purple-600 text-white' :
                      msg.type === 'request' ? 'bg-blue-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {msg.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-semibold text-sm ${
                          msg.type === 'host' ? 'text-red-400' :
                          msg.type === 'moderator' ? 'text-purple-400' :
                          'text-primary'
                        }`}>
                          {msg.user}
                        </span>
                        {msg.role && (
                          <Badge variant="outline" className="text-xs">
                            {msg.role}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-red-400">
                      <Heart className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} className="ash-gradient">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Respectez les autres membres • Pas de spam • Soyez courtois
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Utilisateurs en ligne */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-lg border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                <h3 className="font-bold">En ligne ({onlineUsers.length})</h3>
              </div>

              <div className="space-y-3">
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-black flex items-center justify-center text-xs font-bold text-white">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name[0]
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        user.status === 'live' ? 'bg-red-500 animate-pulse' :
                        user.status === 'online' ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>

                    {user.status === 'live' && (
                      <Badge className="bg-red-500 text-white text-xs">
                        <Mic className="w-2 h-2 mr-1" />
                        LIVE
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Règles du chat */}
            <div className="glass-effect rounded-lg border border-white/10 p-4 mt-6">
              <h3 className="font-bold mb-3">Règles du Chat</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Respectez tous les membres</li>
                <li>• Pas de contenu inapproprié</li>
                <li>• Pas de spam ou de flood</li>
                <li>• Utilisez les demandes musicales avec modération</li>
                <li>• Amusez-vous et profitez de la musique !</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Espace pour le player fixe */}
      <div className="h-20" />
    </div>
  )
}
