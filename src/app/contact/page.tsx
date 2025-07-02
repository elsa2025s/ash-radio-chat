"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Radio, Heart } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "contact@ashradio-direct.com",
      description: "Pour toute question générale"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: "+33 1 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: "123 Rue de la Musique, 75001 Paris",
      description: "Studios ASH Radio"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: "24h/24 - 7j/7",
      description: "Diffusion en continu"
    }
  ]

  const departments = [
    {
      name: "Direction",
      email: "direction@ashradio-direct.com",
      contact: "Chloé.D",
      description: "Questions sur la programmation et partenariats"
    },
    {
      name: "Technique",
      email: "technique@ashradio-direct.com",
      contact: "Ludomix.R",
      description: "Problèmes de diffusion et qualité audio"
    },
    {
      name: "Animation",
      email: "animation@ashradio-direct.com",
      contact: "Ashley",
      description: "Demandes d'interviews et collaborations"
    },
    {
      name: "Partenariats",
      email: "partenariats@ashradio-direct.com",
      contact: "Équipe commerciale",
      description: "Sponsoring et événements"
    }
  ]

  const socialMedia = [
    { name: "Facebook", url: "#", followers: "25.3K" },
    { name: "Twitter", url: "#", followers: "18.7K" },
    { name: "Instagram", url: "#", followers: "32.1K" },
    { name: "YouTube", url: "#", followers: "12.5K" },
    { name: "TikTok", url: "#", followers: "8.9K" },
    { name: "Discord", url: "#", followers: "5.2K" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici on traiterait l'envoi du formulaire
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold ash-text-gradient mb-4">
            CONTACT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question, une suggestion, une demande ? Nous sommes là pour vous écouter !
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-lg p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sujet</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Objet de votre message"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="ash-gradient w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            </div>

            {/* Services spécialisés */}
            <div className="glass-effect rounded-lg p-8 border border-white/10 mt-8">
              <h2 className="text-2xl font-bold mb-6">Services Spécialisés</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {departments.map((dept, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-2">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{dept.description}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{dept.contact}</p>
                      <a href={`mailto:${dept.email}`} className="text-sm text-primary hover:underline">
                        {dept.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            {/* Coordonnées */}
            <div className="glass-effect rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-6">Nos Coordonnées</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full ash-gradient flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      <p className="text-sm text-primary">{info.details}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut en direct */}
            <div className="glass-effect rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-xl font-bold">En Direct</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Radio className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Ashley - Wake Up 80s</p>
                    <p className="text-sm text-muted-foreground">Jusqu'à 09:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">2,847 auditeurs</p>
                    <p className="text-sm text-muted-foreground">En écoute maintenant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="glass-effect rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Suivez-nous</h2>
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:border-primary/30 transition-colors"
                  >
                    <span className="font-medium">{social.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {social.followers}
                    </Badge>
                  </a>
                ))}
              </div>
            </div>

            {/* Chat direct */}
            <div className="glass-effect rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Chat en Direct</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Rejoignez notre chatroom pour discuter en temps réel avec l'équipe et la communauté.
              </p>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Rejoindre le Chat
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Espace pour le player fixe */}
      <div className="h-20" />
    </div>
  )
}
