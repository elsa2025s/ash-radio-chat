import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Heart, Share2 } from "lucide-react"

export default function MusiquePage() {
  const categories = [
    {
      title: "Années 80",
      description: "Les plus grands hits des années 80",
      tracks: 245,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      title: "Années 90",
      description: "Dance, pop et rock des années 90",
      tracks: 312,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
    },
    {
      title: "Années 2000",
      description: "Le début du nouveau millénaire",
      tracks: 198,
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
    }
  ]

  const playlists = [
    { title: "Road Trip 80s", duration: "2h 45min", tracks: 34 },
    { title: "Dance Floor 90s", duration: "1h 32min", tracks: 23 },
    { title: "Best of 2000", duration: "3h 12min", tracks: 41 },
    { title: "Love Songs", duration: "2h 18min", tracks: 28 },
    { title: "Rock Legends", duration: "2h 56min", tracks: 36 },
    { title: "Pop Hits", duration: "1h 48min", tracks: 26 }
  ]

  const recentTracks = [
    { title: "Sweet Dreams", artist: "Eurythmics", album: "Sweet Dreams", year: "1983", duration: "3:36" },
    { title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", year: "1982", duration: "4:54" },
    { title: "Like a Prayer", artist: "Madonna", album: "Like a Prayer", year: "1989", duration: "5:43" },
    { title: "Don't Stop Believin'", artist: "Journey", album: "Escape", year: "1981", duration: "4:10" },
    { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", album: "She's So Unusual", year: "1983", duration: "3:58" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            NOTRE MUSIQUE
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre collection de hits intemporels des années 80, 90 et 2000
          </p>
        </div>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Catégories Musicales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="glass-effect rounded-lg overflow-hidden border border-white/10 group cursor-pointer hover:scale-105 transition-transform">
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="lg" className="ash-gradient rounded-full">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <Badge className="absolute top-4 right-4 ash-gradient">
                    {category.tracks} titres
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{category.title}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Playlists */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Playlists Populaires</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist, index) => (
              <div key={index} className="glass-effect rounded-lg p-6 border border-white/10 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{playlist.title}</h3>
                    <p className="text-sm text-muted-foreground">{playlist.tracks} titres • {playlist.duration}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ash-gradient rounded-full w-10 h-10 p-0">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Tracks */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Derniers Titres Joués</h2>
          <div className="glass-effect rounded-lg border border-white/10">
            {recentTracks.map((track, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-black flex items-center justify-center">
                  <Button size="sm" variant="ghost" className="w-8 h-8 p-0">
                    <Play className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">{track.artist} • {track.album}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{track.year}</p>
                  <p className="text-sm font-mono">{track.duration}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share2 className="w-4 h-4" />
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
