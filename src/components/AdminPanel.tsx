'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Settings,
  Users,
  Radio,
  Mic,
  Calendar,
  BarChart3,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Save,
  Eye,
  Volume2,
  Clock,
  Headphones,
  MessageSquare,
  TrendingUp,
  Download
} from 'lucide-react'

interface Show {
  id: string
  title: string
  host: string
  schedule: string
  status: 'live' | 'scheduled' | 'ended'
  listeners: number
  description: string
}

interface Podcast {
  id: string
  title: string
  category: string
  episodes: number
  downloads: number
  lastEpisode: string
  status: 'published' | 'draft'
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'host' | 'listener'
  joinDate: string
  status: 'active' | 'inactive'
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)

  // États pour les émissions
  const [shows, setShows] = useState<Show[]>([
    {
      id: '1',
      title: 'Morning Boost',
      host: 'Sarah Collins',
      schedule: '06:00 - 10:00',
      status: 'live',
      listeners: 1250,
      description: 'Émission matinale pour bien commencer la journée'
    },
    {
      id: '2',
      title: 'Lunch Break',
      host: 'Mike Johnson',
      schedule: '12:00 - 14:00',
      status: 'scheduled',
      listeners: 0,
      description: 'Musique relaxante pour la pause déjeuner'
    },
    {
      id: '3',
      title: 'Drive Time',
      host: 'Emma Wilson',
      schedule: '17:00 - 20:00',
      status: 'ended',
      listeners: 0,
      description: 'Les meilleurs hits pour le retour du travail'
    }
  ])

  // États pour les podcasts
  const [podcasts, setPodcasts] = useState<Podcast[]>([
    {
      id: '1',
      title: 'Tech Talk Daily',
      category: 'Technologie',
      episodes: 125,
      downloads: 25600,
      lastEpisode: '2024-12-15',
      status: 'published'
    },
    {
      id: '2',
      title: 'Music Legends',
      category: 'Musique',
      episodes: 89,
      downloads: 18900,
      lastEpisode: '2024-12-14',
      status: 'published'
    },
    {
      id: '3',
      title: 'Culture & Société',
      category: 'Culture',
      episodes: 156,
      downloads: 32100,
      lastEpisode: '2024-12-13',
      status: 'draft'
    }
  ])

  // États pour les utilisateurs
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Collins',
      email: 'sarah@ashradio.com',
      role: 'host',
      joinDate: '2023-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@ashradio.com',
      role: 'host',
      joinDate: '2023-03-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@ashradio.com',
      role: 'admin',
      joinDate: '2022-12-01',
      status: 'active'
    }
  ])

  // Formulaire nouvelle émission
  const [newShow, setNewShow] = useState({
    title: '',
    host: '',
    schedule: '',
    description: ''
  })

  // Formulaire nouveau podcast
  const [newPodcast, setNewPodcast] = useState({
    title: '',
    category: '',
    description: ''
  })

  // Statistiques
  const stats = {
    totalListeners: 3450,
    activeShows: shows.filter(s => s.status === 'live').length,
    totalPodcasts: podcasts.length,
    totalDownloads: podcasts.reduce((sum, p) => sum + p.downloads, 0),
    onlineUsers: 892,
    todayListeners: 1250
  }

  const addNewShow = () => {
    if (!newShow.title || !newShow.host || !newShow.schedule) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const show: Show = {
      id: Date.now().toString(),
      title: newShow.title,
      host: newShow.host,
      schedule: newShow.schedule,
      status: 'scheduled',
      listeners: 0,
      description: newShow.description
    }

    setShows([...shows, show])
    setNewShow({ title: '', host: '', schedule: '', description: '' })
    alert('Émission créée avec succès !')
  }

  const addNewPodcast = () => {
    if (!newPodcast.title || !newPodcast.category) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    const podcast: Podcast = {
      id: Date.now().toString(),
      title: newPodcast.title,
      category: newPodcast.category,
      episodes: 0,
      downloads: 0,
      lastEpisode: new Date().toISOString().split('T')[0],
      status: 'draft'
    }

    setPodcasts([...podcasts, podcast])
    setNewPodcast({ title: '', category: '', description: '' })
    alert('Podcast créé avec succès !')
  }

  const deleteShow = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette émission ?')) {
      setShows(shows.filter(s => s.id !== id))
    }
  }

  const deletePodcast = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce podcast ?')) {
      setPodcasts(podcasts.filter(p => p.id !== id))
    }
  }

  const toggleShowStatus = (id: string) => {
    setShows(shows.map(show => {
      if (show.id === id) {
        let newStatus: 'live' | 'scheduled' | 'ended'
        if (show.status === 'scheduled') newStatus = 'live'
        else if (show.status === 'live') newStatus = 'ended'
        else newStatus = 'scheduled'

        return {
          ...show,
          status: newStatus,
          listeners: newStatus === 'live' ? Math.floor(Math.random() * 2000) + 500 : 0
        }
      }
      return show
    }))
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          <Settings className="w-10 h-10 inline-block mr-3 text-red-500" />
          Panneau d'Administration ASH Radio
        </h1>
        <p className="text-gray-400">
          Gérez votre station radio, émissions, podcasts et auditeurs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-600">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="shows" className="data-[state=active]:bg-red-600">
            <Radio className="w-4 h-4 mr-2" />
            Émissions
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="data-[state=active]:bg-red-600">
            <Headphones className="w-4 h-4 mr-2" />
            Podcasts
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
            <Users className="w-4 h-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-red-600">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Auditeurs en ligne</p>
                    <p className="text-3xl font-bold text-white">{stats.onlineUsers.toLocaleString()}</p>
                  </div>
                  <Volume2 className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Émissions actives</p>
                    <p className="text-3xl font-bold text-white">{stats.activeShows}</p>
                  </div>
                  <Radio className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total podcasts</p>
                    <p className="text-3xl font-bold text-white">{stats.totalPodcasts}</p>
                  </div>
                  <Headphones className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Téléchargements</p>
                    <p className="text-3xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
                  </div>
                  <Download className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Auditeurs aujourd'hui</p>
                    <p className="text-3xl font-bold text-white">{stats.todayListeners.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Messages chat</p>
                    <p className="text-3xl font-bold text-white">2.8k</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-cyan-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Émissions en cours */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Émissions en Direct</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shows.filter(show => show.status === 'live').map((show) => (
                  <div key={show.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <div>
                        <h4 className="font-semibold text-white">{show.title}</h4>
                        <p className="text-sm text-gray-400">{show.host} • {show.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{show.listeners.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">auditeurs</p>
                    </div>
                  </div>
                ))}
                {shows.filter(show => show.status === 'live').length === 0 && (
                  <p className="text-gray-400 text-center py-8">Aucune émission en direct actuellement</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des émissions */}
        <TabsContent value="shows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste des émissions */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Émissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shows.map((show) => (
                    <div key={show.id} className="border border-white/10 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{show.title}</h4>
                          <p className="text-sm text-gray-400">{show.host}</p>
                        </div>
                        <Badge className={`${
                          show.status === 'live' ? 'bg-red-500' :
                          show.status === 'scheduled' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}>
                          {show.status === 'live' ? '🔴 EN DIRECT' :
                           show.status === 'scheduled' ? '📅 Programmé' :
                           '✅ Terminé'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{show.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {show.schedule}
                          {show.status === 'live' && (
                            <>
                              <Volume2 className="w-4 h-4 ml-2" />
                              {show.listeners.toLocaleString()}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleShowStatus(show.id)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            {show.status === 'live' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteShow(show.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nouvelle émission */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  Nouvelle Émission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre de l'émission *
                  </label>
                  <Input
                    value={newShow.title}
                    onChange={(e) => setNewShow({ ...newShow, title: e.target.value })}
                    placeholder="Ex: Morning Boost"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Animateur *
                  </label>
                  <Select value={newShow.host} onValueChange={(value) => setNewShow({ ...newShow, host: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionner un animateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Collins">Sarah Collins</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Emma Wilson">Emma Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Horaire *
                  </label>
                  <Input
                    value={newShow.schedule}
                    onChange={(e) => setNewShow({ ...newShow, schedule: e.target.value })}
                    placeholder="Ex: 06:00 - 10:00"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={newShow.description}
                    onChange={(e) => setNewShow({ ...newShow, description: e.target.value })}
                    placeholder="Description de l'émission..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <Button
                  onClick={addNewShow}
                  className="w-full ash-gradient hover:opacity-90"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Créer l'Émission
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestion des podcasts */}
        <TabsContent value="podcasts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste des podcasts */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Podcasts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {podcasts.map((podcast) => (
                    <div key={podcast.id} className="border border-white/10 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{podcast.title}</h4>
                          <p className="text-sm text-gray-400">{podcast.category}</p>
                        </div>
                        <Badge className={podcast.status === 'published' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {podcast.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-300 mb-3">
                        <div>
                          <span className="text-gray-400">Épisodes:</span>
                          <p className="font-semibold">{podcast.episodes}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Downloads:</span>
                          <p className="font-semibold">{podcast.downloads.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Dernier:</span>
                          <p className="font-semibold">{podcast.lastEpisode}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deletePodcast(podcast.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nouveau podcast */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  Nouveau Podcast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre du podcast *
                  </label>
                  <Input
                    value={newPodcast.title}
                    onChange={(e) => setNewPodcast({ ...newPodcast, title: e.target.value })}
                    placeholder="Ex: Tech Talk Daily"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Catégorie *
                  </label>
                  <Select value={newPodcast.category} onValueChange={(value) => setNewPodcast({ ...newPodcast, category: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technologie">Technologie</SelectItem>
                      <SelectItem value="Musique">Musique</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Sport">Sport</SelectItem>
                      <SelectItem value="Actualité">Actualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={newPodcast.description}
                    onChange={(e) => setNewPodcast({ ...newPodcast, description: e.target.value })}
                    placeholder="Description du podcast..."
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <Button
                  onClick={addNewPodcast}
                  className="w-full ash-gradient hover:opacity-90"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Créer le Podcast
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestion des utilisateurs */}
        <TabsContent value="users" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-black flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${
                        user.role === 'admin' ? 'bg-purple-600' :
                        user.role === 'host' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' :
                         user.role === 'host' ? 'Animateur' :
                         'Auditeur'}
                      </Badge>
                      <span className="text-sm text-gray-400">{user.joinDate}</span>
                      <Badge className={user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Paramètres de la Station</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom de la station
                  </label>
                  <Input
                    defaultValue="ASH Radio"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slogan
                  </label>
                  <Input
                    defaultValue="Votre station radio moderne"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL du stream
                  </label>
                  <Input
                    defaultValue="https://stream.ashradio.com/live"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact email
                  </label>
                  <Input
                    defaultValue="contact@ashradio.com"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button className="ash-gradient hover:opacity-90">
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les Paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
