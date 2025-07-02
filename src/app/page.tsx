'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Headphones, Heart, Play, TrendingUp, Users, Mic } from 'lucide-react'

export default function HomePage() {
  // Données pour les sections
  const topTracks = [
    { rank: 1, title: "Summer Vibes", artist: "DJ Ash", duration: "3:45" },
    { rank: 2, title: "Night Dreams", artist: "Luna Sky", duration: "4:20" },
    { rank: 3, title: "Urban Beat", artist: "City Sounds", duration: "3:30" },
    { rank: 4, title: "Ocean Waves", artist: "Nature Mix", duration: "5:15" },
    { rank: 5, title: "Electric Soul", artist: "Volt Music", duration: "3:58" },
  ];

  const programs = [
    {
      title: "Morning Boost",
      host: "Sarah Collins",
      time: "06:00 - 10:00",
      description: "Commencez votre journée avec de l'énergie positive",
      live: true,
    },
    {
      title: "Lunch Break",
      host: "Mike Johnson",
      time: "12:00 - 14:00",
      description: "La parfaite pause déjeuner avec les meilleurs hits",
      live: false,
    },
    {
      title: "Drive Time",
      host: "Emma Wilson",
      time: "17:00 - 20:00",
      description: "Votre compagnon pour le trajet du retour",
      live: false,
    },
  ];

  const podcasts = [
    {
      title: "Tech Talk Daily",
      episodes: 125,
      category: "Technologie",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop",
    },
    {
      title: "Music Legends",
      episodes: 89,
      category: "Musique",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    },
    {
      title: "Culture & Société",
      episodes: 156,
      category: "Culture",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
    },
  ];

  const teamMembers = [
    {
      name: "DJ Ash",
      role: "Directeur Artistique",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      speciality: "Hip-Hop & R&B",
    },
    {
      name: "Luna Sky",
      role: "Animatrice principale",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop",
      speciality: "Pop & Electronic",
    },
    {
      name: "Carlos Beat",
      role: "Producteur",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      speciality: "Latin & Reggaeton",
    },
    {
      name: "Sophie Mix",
      role: "Journaliste",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      speciality: "News & Culture",
    },
  ];

  const news = [
    {
      title: "Nouveau studio d'enregistrement inauguré",
      excerpt: "ASH Radio ouvre son nouveau studio haute technologie pour des émissions encore plus qualitatives.",
      date: "15 Déc 2024",
      category: "Studio",
    },
    {
      title: "Festival ASH Summer 2025 annoncé",
      excerpt: "Découvrez la programmation exceptionnelle de notre festival d'été avec les plus grands artistes.",
      date: "12 Déc 2024",
      category: "Événement",
    },
    {
      title: "Partenariat avec Universal Music",
      excerpt: "Un nouveau partenariat qui nous permettra de vous offrir les derniers hits en exclusivité.",
      date: "10 Déc 2024",
      category: "Partenariat",
    },
  ];

  const events = [
    {
      title: "Live Session avec Aya Nakamura",
      date: "22 Déc 2024",
      time: "20:00",
      location: "Studio ASH Radio",
      type: "Live",
    },
    {
      title: "Concours de remix",
      date: "25 Déc 2024",
      time: "Toute la journée",
      location: "En ligne",
      type: "Concours",
    },
    {
      title: "Soirée Nouvel An ASH",
      date: "31 Déc 2024",
      time: "22:00",
      location: "Club Metropolis",
      type: "Événement",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      {/* Hero Section avec Vidéo */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Vidéo de fond */}
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://ext.same-assets.com/3147506062/radio-poster.jpg"
          >
            <source src="https://ext.same-assets.com/3147506062/ash-radio-promo.mp4" type="video/mp4" />
            <source src="https://ext.same-assets.com/3147506062/ash-radio-promo.webm" type="video/webm" />
            {/* Fallback pour navigateurs ne supportant pas video */}
            <img
              src="https://ext.same-assets.com/3147506062/radio-poster.jpg"
              alt="ASH Radio"
              className="w-full h-full object-cover"
            />
          </video>
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-red-600/90 text-white text-sm font-semibold px-4 py-2">
            🔴 EN DIRECT
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              ASH RADIO
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Votre station radio moderne - Musique, émissions, podcasts et bien plus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="ash-gradient hover:opacity-90 transition-opacity text-white font-semibold px-8 py-3">
              <Play className="w-5 h-5 mr-2" />
              Écouter en direct
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
              <Headphones className="w-5 h-5 mr-2" />
              Découvrir nos podcasts
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      <div className="relative z-10">
        {/* Top Charts */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <TrendingUp className="w-8 h-8 inline-block mr-3 text-red-500" />
                Top 5 de la semaine
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Découvrez les titres les plus écoutés cette semaine sur ASH Radio
              </p>
            </div>

            <Card className="glass-effect border-white/10 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topTracks.map((track) => (
                    <div key={track.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-8 h-8 rounded-full ash-gradient text-white flex items-center justify-center font-bold text-sm">
                        {track.rank}
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-black" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{track.title}</h4>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                      <div className="text-sm text-gray-400">{track.duration}</div>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <Mic className="w-8 h-8 inline-block mr-3 text-red-500" />
                Nos Émissions
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Découvrez notre programmation variée avec des animateurs passionnés
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <Card key={index} className="glass-effect border-white/10 relative overflow-hidden group hover:scale-105 transition-transform">
                  {program.live && (
                    <Badge className="absolute top-4 right-4 z-10 bg-red-500 text-white animate-pulse">
                      🔴 LIVE
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
                      <p className="text-red-400 font-medium">{program.host}</p>
                      <p className="text-sm text-gray-400">{program.time}</p>
                    </div>
                    <p className="text-gray-300 mb-4">{program.description}</p>
                    <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Play className="w-4 h-4 mr-2" />
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Podcasts */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <Headphones className="w-8 h-8 inline-block mr-3 text-red-500" />
                Podcasts Populaires
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explorez notre collection de podcasts sur des sujets variés
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast, index) => (
                <Card key={index} className="glass-effect border-white/10 overflow-hidden group hover:scale-105 transition-transform">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={podcast.image}
                      alt={podcast.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-black/70 text-white">
                      {podcast.episodes} épisodes
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-red-600/20 text-red-400">
                      {podcast.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{podcast.title}</h3>
                    <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Play className="w-4 h-4 mr-2" />
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <Users className="w-8 h-8 inline-block mr-3 text-red-500" />
                Notre Équipe
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Rencontrez les voix qui donnent vie à ASH Radio
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="glass-effect border-white/10 text-center group hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-red-500/20">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-red-400 text-sm font-medium mb-2">{member.role}</p>
                    <Badge className="bg-gray-800/50 text-gray-300 text-xs">
                      {member.speciality}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* News */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                📰 Actualités
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Restez informés des dernières nouvelles d'ASH Radio
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <Card key={index} className="glass-effect border-white/10 group hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-red-600/20 text-red-400">
                        {article.category}
                      </Badge>
                      <span className="text-sm text-gray-400">{article.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{article.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                <Calendar className="w-8 h-8 inline-block mr-3 text-red-500" />
                Événements à venir
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Ne manquez aucun de nos événements exclusifs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <Card key={index} className="glass-effect border-white/10 group hover:scale-105 transition-transform">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-red-600/20 text-red-400">
                        {event.type}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {event.time}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{event.title}</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-red-400" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <span className="w-4 h-4 mr-2 text-red-400">📍</span>
                        {event.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Chat Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              💬 Rejoignez la conversation
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Chattez en direct avec les animateurs et la communauté ASH Radio
            </p>
            <Card className="glass-effect border-white/10 p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-black border-2 border-gray-800" />
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-green-400 font-bold">342</span> auditeurs en ligne
                </div>
              </div>
              <Button size="lg" className="ash-gradient hover:opacity-90 transition-opacity text-white font-semibold">
                Accéder au chat
              </Button>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/40 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">ASH RADIO</h3>
                <p className="text-gray-400 mb-4">
                  Votre station radio moderne pour une expérience musicale unique.
                </p>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                    <div key={social} className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center cursor-pointer hover:bg-red-600/40 transition-colors">
                      <Heart className="w-4 h-4 text-red-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Navigation</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/musique" className="hover:text-red-400 transition-colors">Musique</a></li>
                  <li><a href="/emissions" className="hover:text-red-400 transition-colors">Émissions</a></li>
                  <li><a href="/podcasts" className="hover:text-red-400 transition-colors">Podcasts</a></li>
                  <li><a href="/animateurs" className="hover:text-red-400 transition-colors">Animateurs</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Communauté</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/chatroom" className="hover:text-red-400 transition-colors">Chat en direct</a></li>
                  <li><a href="/evenements" className="hover:text-red-400 transition-colors">Événements</a></li>
                  <li><a href="/contact" className="hover:text-red-400 transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-4">Contact</h4>
                <div className="space-y-2 text-gray-400 text-sm">
                  <p>📍 123 Rue de la Radio, Paris</p>
                  <p>📞 +33 1 23 45 67 89</p>
                  <p>✉️ contact@ashradio.com</p>
                  <p>🌐 ashradio-direct.com</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2024 ASH Radio. Tous droits réservés. | Développé avec ❤️ pour la communauté
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
