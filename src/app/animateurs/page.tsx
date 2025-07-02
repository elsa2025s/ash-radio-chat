import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, MessageSquare, Heart } from "lucide-react"

export default function AnimateursPage() {
  const animateurs = [
    {
      name: "Ashley",
      role: "Animateur Principal",
      specialty: "Années 80-2000",
      image: "https://ext.same-assets.com/3147506062/1283814652.jpeg",
      bio: "Passionné de musique des années 80-2000, Ashley vous fait vibrer avec ses sélections musicales depuis plus de 8 ans. Expert des tubes incontournables et des perles rares.",
      shows: ["Wake Up 80s", "Mix du Samedi"],
      schedule: "Lun-Ven 06:00-09:00",
      followers: "12.3K",
      isFounder: true,
      social: { twitter: "@ashley_ashradio", instagram: "@ashley.music" }
    },
    {
      name: "Ludomix.R",
      role: "Ingénieur Son / Opérateur",
      specialty: "Années 90",
      image: "https://ext.same-assets.com/3147506062/3507805746.jpeg",
      bio: "Expert des hits des années 90, Ludomix vous fait redécouvrir les classiques qui ont marqué cette décennie. Technicien audio de formation, il maîtrise l'art du mix parfait.",
      shows: ["Soirée 90s", "Tech Mix"],
      schedule: "Sam-Dim 20:00-22:00",
      followers: "8.7K",
      isFounder: true,
      social: { twitter: "@ludomix_r", instagram: "@ludomix.studio" }
    },
    {
      name: "Chloé.D",
      role: "Directrice d'Antenne",
      specialty: "Programmation",
      image: "https://ext.same-assets.com/3147506062/3053868151.jpeg",
      bio: "Ma mission ? Vous faire vivre des moments intenses et authentiques grâce à une programmation riche et variée. Je supervise l'ensemble de nos contenus.",
      shows: ["Café Musical", "Flash Actu"],
      schedule: "Lun-Mer-Ven 10:00-12:00",
      followers: "15.2K",
      isFounder: true,
      social: { twitter: "@chloe_ashradio", instagram: "@chloe.director" }
    },
    {
      name: "Melissa",
      role: "Animatrice",
      specialty: "Années 2000",
      image: "https://ext.same-assets.com/3147506062/2286987542.jpeg",
      bio: "Spécialiste des années 2000, Melissa vous fait revivre les tubes qui ont marqué le début du millénaire. Énergie et bonne humeur garanties !",
      shows: ["Pop 2000", "Happy Hour"],
      schedule: "Mar-Jeu 16:00-18:00",
      followers: "6.9K",
      isFounder: false,
      social: { twitter: "@melissa_2000", instagram: "@melissa.pop" }
    },
    {
      name: "Djfredj",
      role: "DJ / Intervenant",
      specialty: "Mix Endiablés",
      image: "https://ext.same-assets.com/3147506062/1925804273.jpeg",
      bio: "Avec ses mix endiablés, Djfredj vous fait danser sur les meilleurs sons des trois dernières décennies. DJ professionnel depuis 15 ans.",
      shows: ["Mix 2000", "Night Club"],
      schedule: "Ven-Sam 22:00-00:00",
      followers: "9.1K",
      isFounder: false,
      social: { twitter: "@djfredj_mix", instagram: "@djfredj.official" }
    },
    {
      name: "Laeticia",
      role: "Animatrice",
      specialty: "Pépites Oubliées",
      image: "https://ext.same-assets.com/3147506062/3219134691.jpeg",
      bio: "Passionnée de musique, Laeticia vous fait découvrir des pépites oubliées des années 80 à 2000. Elle déniche les trésors musicaux cachés.",
      shows: ["Trésors Cachés", "Dimanche Vintage"],
      schedule: "Dim 14:00-17:00",
      followers: "4.8K",
      isFounder: false,
      social: { twitter: "@laeticia_music", instagram: "@laeticia.vintage" }
    },
    {
      name: "Zoé.H",
      role: "Animatrice",
      specialty: "Voyage Musical",
      image: "https://ext.same-assets.com/3147506062/1648610338.jpeg",
      bio: "Zoé vous embarque dans un voyage musical, entre souvenirs et découvertes des années 90 à aujourd'hui. Conteuse passionnée et guide musical.",
      shows: ["Voyage Rétro", "Stories & Songs"],
      schedule: "Mar-Jeu 14:00-16:00",
      followers: "7.3K",
      isFounder: false,
      social: { twitter: "@zoe_ashradio", instagram: "@zoe.journey" }
    },
    {
      name: "Aline",
      role: "Animatrice",
      specialty: "Anecdotes Rétro",
      image: "https://ext.same-assets.com/3147506062/2383125630.jpeg",
      bio: "Avec sa voix chaleureuse, Aline partage ses coups de cœur musicaux et ses anecdotes rétro chaque semaine. Historienne de la musique populaire.",
      shows: ["Love Songs", "Rétro Stories"],
      schedule: "Dim 18:00-20:00",
      followers: "5.6K",
      isFounder: false,
      social: { twitter: "@aline_stories", instagram: "@aline.retro" }
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            NOTRE ÉQUIPE
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les voix qui font vibrer ASH Radio jour après jour
          </p>
        </div>

        {/* Fondateurs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Équipe Fondatrice</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {animateurs.filter(animateur => animateur.isFounder).map((animateur, index) => (
              <div key={index} className="glass-effect rounded-lg p-6 border border-white/10 text-center relative">
                <Badge className="absolute top-4 right-4 ash-gradient text-white">
                  Fondateur
                </Badge>

                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={animateur.image}
                    alt={animateur.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold text-xl mb-1">{animateur.name}</h3>
                <p className="text-primary font-medium mb-2">{animateur.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{animateur.specialty}</p>

                <p className="text-sm mb-4">{animateur.bio}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {animateur.schedule}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Heart className="w-4 h-4" />
                    {animateur.followers} followers
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Animateurs */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Nos Animateurs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {animateurs.filter(animateur => !animateur.isFounder).map((animateur, index) => (
              <div key={index} className="glass-effect rounded-lg p-6 border border-white/10 text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                  <img
                    src={animateur.image}
                    alt={animateur.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold text-lg mb-1">{animateur.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{animateur.role}</p>
                <p className="text-xs text-muted-foreground mb-3">{animateur.specialty}</p>

                <p className="text-xs mb-3">{animateur.bio}</p>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Clock className="w-3 h-3" />
                    {animateur.schedule}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Heart className="w-3 h-3" />
                    {animateur.followers}
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  Voir Profil
                </Button>
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
