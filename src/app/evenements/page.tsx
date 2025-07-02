import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Ticket, Star } from "lucide-react"

export default function EvenementsPage() {
  const upcomingEvents = [
    {
      title: "Soirée Rétro 80s - Live",
      date: "2025-02-14",
      time: "20:00",
      location: "Studio ASH Radio",
      type: "Concert Live",
      description: "Une soirée exceptionnelle avec nos animateurs en direct et des invités surprises",
      price: "Gratuit",
      capacity: "50 places",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
      featured: true,
      available: true
    },
    {
      title: "Rencontre avec les Auditeurs",
      date: "2025-02-20",
      time: "18:30",
      location: "Café Central, Paris",
      type: "Rencontre",
      description: "Venez rencontrer l'équipe ASH Radio autour d'un verre et partagez vos souvenirs musicaux",
      price: "5€",
      capacity: "30 places",
      image: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=600&h=400&fit=crop",
      featured: false,
      available: true
    },
    {
      title: "Festival Rétro - ASH Radio Stage",
      date: "2025-03-15",
      time: "14:00",
      location: "Parc des Expositions",
      type: "Festival",
      description: "ASH Radio présente sa scène au plus grand festival rétro de France",
      price: "25€",
      capacity: "2000 places",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
      featured: true,
      available: true
    }
  ]

  const pastEvents = [
    {
      title: "Concert Années 90 - Spécial Eurodance",
      date: "2024-12-20",
      location: "Studio ASH Radio",
      attendees: "45",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop"
    },
    {
      title: "Blind Test Géant - Années 80",
      date: "2024-11-25",
      location: "Salle Municipale",
      attendees: "120",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop"
    },
    {
      title: "Interview Live - Producteur Légendaire",
      date: "2024-10-30",
      location: "Studio ASH Radio",
      attendees: "25",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop"
    }
  ]

  const onlineEvents = [
    {
      title: "Live Stream - Marathon 24h Années 80",
      date: "2025-02-01",
      time: "00:00",
      description: "24h non-stop de hits des années 80 avec toute l'équipe qui se relaie",
      viewers: "Live",
      platform: "YouTube & Facebook"
    },
    {
      title: "Blind Test en Ligne",
      date: "2025-02-08",
      time: "21:00",
      description: "Testez vos connaissances musicales avec nos animateurs",
      viewers: "500 max",
      platform: "Twitch"
    },
    {
      title: "Karaoké Virtuel Rétro",
      date: "2025-02-22",
      time: "20:30",
      description: "Chantez vos hits préférés avec la communauté ASH Radio",
      viewers: "100 max",
      platform: "Discord"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            ÉVÉNEMENTS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Retrouvez-nous lors de nos événements spéciaux et rencontres exclusives
          </p>
        </div>

        {/* Événements à venir */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Prochains Événements</h2>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={`glass-effect rounded-lg overflow-hidden border border-white/10 ${event.featured ? 'ring-2 ring-primary/50' : ''}`}>
                {event.featured && (
                  <Badge className="absolute top-4 left-4 z-10 ash-gradient text-white">
                    ⭐ À ne pas manquer
                  </Badge>
                )}

                <div className="aspect-video relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <Badge className="absolute bottom-4 left-4 bg-black/70 text-white">
                    {event.type}
                  </Badge>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      {event.capacity}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ticket className="w-4 h-4 text-primary" />
                      {event.price}
                    </div>
                  </div>

                  <Button className={`w-full ${event.available ? 'ash-gradient' : 'bg-gray-600'}`} disabled={!event.available}>
                    {event.available ? 'Réserver' : 'Complet'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Événements en ligne */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Événements en Ligne</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineEvents.map((event, index) => (
              <div key={index} className="glass-effect rounded-lg p-6 border border-white/10">
                <Badge className="mb-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  🌐 En ligne
                </Badge>
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    {event.viewers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Plateforme: {event.platform}
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Participer
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Événements passés */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Événements Passés</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div key={index} className="glass-effect rounded-lg overflow-hidden border border-white/10">
                <div className="aspect-video">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {event.attendees} participants
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {event.rating}/5 ({Math.floor(Math.random() * 20) + 10} avis)
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Voir les photos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Espace pour le player fixe */}
      <div className="h-20" />
    </div>
  )
}
