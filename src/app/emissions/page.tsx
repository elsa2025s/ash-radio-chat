import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Calendar, Play } from "lucide-react"

export default function EmissionsPage() {
  const emissions = [
    {
      title: "Wake Up 80s",
      time: "06:00 - 09:00",
      host: "Ashley",
      description: "Réveillez-vous en douceur avec les plus beaux hits des années 80",
      days: ["Lun", "Mar", "Mer", "Jeu", "Ven"],
      listeners: "2.3K",
      image: "https://ext.same-assets.com/3147506062/1283814652.jpeg",
      live: false
    },
    {
      title: "Soirée 90s",
      time: "20:00 - 22:00",
      host: "Ludomix.R",
      description: "Plongez dans l'ambiance des années 90 avec les meilleurs hits",
      days: ["Sam", "Dim"],
      listeners: "4.1K",
      image: "https://ext.same-assets.com/3147506062/3507805746.jpeg",
      live: true
    },
    {
      title: "Mix 2000",
      time: "22:00 - 00:00",
      host: "Djfredj",
      description: "Les hits du début du millénaire dans un mix endiablé",
      days: ["Ven", "Sam"],
      listeners: "3.8K",
      image: "https://ext.same-assets.com/3147506062/1925804273.jpeg",
      live: false
    },
    {
      title: "Café Musical",
      time: "10:00 - 12:00",
      host: "Chloé.D",
      description: "Une pause musicale en douceur avec les perles oubliées",
      days: ["Lun", "Mer", "Ven"],
      listeners: "1.9K",
      image: "https://ext.same-assets.com/3147506062/3053868151.jpeg",
      live: false
    },
    {
      title: "Voyage Rétro",
      time: "14:00 - 16:00",
      host: "Zoé.H",
      description: "Un voyage musical à travers les décennies passées",
      days: ["Mar", "Jeu"],
      listeners: "2.7K",
      image: "https://ext.same-assets.com/3147506062/1648610338.jpeg",
      live: false
    },
    {
      title: "Love Songs",
      time: "18:00 - 20:00",
      host: "Aline",
      description: "Les plus belles chansons d'amour des années 80-2000",
      days: ["Dim"],
      listeners: "3.2K",
      image: "https://ext.same-assets.com/3147506062/2383125630.jpeg",
      live: false
    }
  ]

  const schedule = [
    { time: "06:00", show: "Wake Up 80s", host: "Ashley" },
    { time: "09:00", show: "Mix Automatique", host: "Auto" },
    { time: "10:00", show: "Café Musical", host: "Chloé.D" },
    { time: "12:00", show: "Flash Info", host: "Auto" },
    { time: "12:30", show: "Mix Automatique", host: "Auto" },
    { time: "14:00", show: "Voyage Rétro", host: "Zoé.H" },
    { time: "16:00", show: "Mix Automatique", host: "Auto" },
    { time: "18:00", show: "Love Songs", host: "Aline" },
    { time: "20:00", show: "Soirée 90s", host: "Ludomix.R" },
    { time: "22:00", show: "Mix 2000", host: "Djfredj" },
    { time: "00:00", show: "Night Mix", host: "Auto" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            NOS ÉMISSIONS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une programmation riche et variée avec les meilleurs animateurs
          </p>
        </div>

        {/* Émissions principales */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Émissions Principales</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {emissions.map((emission, index) => (
              <div key={index} className="glass-effect rounded-lg p-6 border border-white/10 relative">
                {emission.live && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white animate-pulse">
                    ● EN DIRECT
                  </Badge>
                )}

                <div className="flex gap-4 mb-4">
                  <img
                    src={emission.image}
                    alt={emission.host}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">{emission.title}</h3>
                    <p className="text-primary font-medium">avec {emission.host}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {emission.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {emission.listeners} auditeurs
                      </div>
                    </div>
                  </div>
                  <Button size="lg" className="ash-gradient rounded-full">
                    <Play className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-muted-foreground mb-4">{emission.description}</p>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {emission.days.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grille horaire */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Grille Horaire du Jour</h2>
          <div className="glass-effect rounded-lg border border-white/10">
            {schedule.map((slot, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-b border-white/10 last:border-b-0">
                <div className="ash-gradient text-white text-center py-2 px-4 rounded-lg font-bold min-w-[80px]">
                  {slot.time}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{slot.show}</h4>
                  <p className="text-sm text-muted-foreground">
                    {slot.host === "Auto" ? "Diffusion automatique" : `Animé par ${slot.host}`}
                  </p>
                </div>
                {slot.host !== "Auto" && (
                  <Button size="sm" variant="outline">
                    Écouter
                  </Button>
                )}
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
