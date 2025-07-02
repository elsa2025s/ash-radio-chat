import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download, Heart, Share2, Clock, Calendar } from "lucide-react"

export default function PodcastsPage() {
  const categories = [
    { name: "Best of Années 80", count: 24, color: "from-red-500 to-red-700" },
    { name: "Dance 90's", count: 18, color: "from-red-600 to-black" },
    { name: "Pop 2000", count: 31, color: "from-red-400 to-red-600" },
    { name: "Interviews Exclusives", count: 12, color: "from-black to-red-800" },
    { name: "Mix Spéciaux", count: 15, color: "from-red-700 to-black" },
    { name: "Rétro Stories", count: 22, color: "from-red-500 to-black" }
  ]

  const featuredPodcasts = [
    {
      title: "Best of années 80 - Spécial Noël",
      description: "Une sélection des plus beaux tubes de Noël des années 80",
      host: "Ashley",
      duration: "45:32",
      date: "2025-01-15",
      plays: "12.3K",
      image: "https://ext.same-assets.com/3147506062/1283814652.jpeg",
      category: "Best of Années 80",
      featured: true
    },
    {
      title: "Dance 90's - Mix Eurodance",
      description: "Les plus grands hits eurodance qui ont fait danser les années 90",
      host: "Ludomix.R",
      duration: "52:18",
      date: "2025-01-12",
      plays: "8.7K",
      image: "https://ext.same-assets.com/3147506062/3507805746.jpeg",
      category: "Dance 90's",
      featured: true
    },
    {
      title: "Interview - Les secrets des années 2000",
      description: "Interview exclusive avec un producteur légendaire des années 2000",
      host: "Chloé.D",
      duration: "38:45",
      date: "2025-01-10",
      plays: "15.2K",
      image: "https://ext.same-assets.com/3147506062/3053868151.jpeg",
      category: "Interviews Exclusives",
      featured: true
    }
  ]

  const recentPodcasts = [
    {
      title: "Pop 2000 - Spécial Girl Bands",
      description: "Focus sur les groupes féminins qui ont marqué les années 2000",
      host: "Melissa",
      duration: "41:22",
      date: "2025-01-08",
      plays: "6.9K",
      image: "https://ext.same-assets.com/3147506062/2286987542.jpeg",
      category: "Pop 2000"
    },
    {
      title: "Mix 2000 - Club Hits",
      description: "Les hits club qui ont fait bouger les dancefloors en 2000",
      host: "Djfredj",
      duration: "58:15",
      date: "2025-01-05",
      plays: "9.1K",
      image: "https://ext.same-assets.com/3147506062/1925804273.jpeg",
      category: "Mix Spéciaux"
    },
    {
      title: "Trésors Cachés - Perles Oubliées",
      description: "Découverte de pépites musicales méconnues des années 80-90",
      host: "Laeticia",
      duration: "35:48",
      date: "2025-01-03",
      plays: "4.8K",
      image: "https://ext.same-assets.com/3147506062/3219134691.jpeg",
      category: "Rétro Stories"
    },
    {
      title: "Voyage Rétro - Road Trip Musical",
      description: "Un voyage sonore à travers les hits de route des décennies passées",
      host: "Zoé.H",
      duration: "49:33",
      date: "2025-01-01",
      plays: "7.3K",
      image: "https://ext.same-assets.com/3147506062/1648610338.jpeg",
      category: "Rétro Stories"
    },
    {
      title: "Love Songs - Saint Valentin Rétro",
      description: "Les plus belles chansons d'amour des années 80 à 2000",
      host: "Aline",
      duration: "43:27",
      date: "2024-12-28",
      plays: "5.6K",
      image: "https://ext.same-assets.com/3147506062/2383125630.jpeg",
      category: "Rétro Stories"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            NOS PODCASTS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Retrouvez toutes nos émissions et contenus exclusifs à la demande
          </p>
        </div>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Catégories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className={`bg-gradient-to-br ${category.color} rounded-lg p-6 text-white cursor-pointer hover:scale-105 transition-transform`}>
                <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                <p className="text-white/80">{category.count} épisodes</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Podcasts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">À la Une</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPodcasts.map((podcast, index) => (
              <div key={index} className="glass-effect rounded-lg overflow-hidden border border-white/10 group">
                <div className="aspect-video relative bg-gradient-to-br from-red-600 to-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="ash-gradient rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    À la Une
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                    {podcast.duration}
                  </Badge>
                </div>

                <div className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {podcast.category}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2">{podcast.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{podcast.description}</p>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={podcast.image}
                      alt={podcast.host}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{podcast.host}</p>
                      <p className="text-xs text-muted-foreground">{podcast.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{podcast.plays} écoutes</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Podcasts */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Derniers Épisodes</h2>
          <div className="glass-effect rounded-lg border border-white/10">
            {recentPodcasts.map((podcast, index) => (
              <div key={index} className="flex items-center gap-4 p-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-600 to-black flex items-center justify-center">
                  <Button size="sm" className="w-12 h-12 p-0 bg-white/20 hover:bg-white/30">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {podcast.category}
                  </Badge>
                  <h4 className="font-semibold mb-1">{podcast.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{podcast.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>par {podcast.host}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {podcast.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {podcast.date}
                    </div>
                    <span>{podcast.plays} écoutes</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
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
