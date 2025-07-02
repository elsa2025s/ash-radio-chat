'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Bell,
  BellOff,
  Send,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface NotificationData {
  id: string
  title: string
  message: string
  timestamp: string
  sent: boolean
  recipients: number
}

export default function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<NotificationData[]>([
    {
      id: '1',
      title: 'Nouvelle émission en direct',
      message: 'Ne manquez pas l\'émission spéciale années 90 qui commence maintenant !',
      timestamp: '2024-12-15 14:30',
      sent: true,
      recipients: 1250
    },
    {
      id: '2',
      title: 'Concours exclusif',
      message: 'Participez à notre concours et gagnez des billets de concert !',
      timestamp: '2024-12-15 12:00',
      sent: true,
      recipients: 980
    }
  ])

  // Vérifier si les notifications sont supportées
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      checkSubscriptionStatus()
    }
  }, [])

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        setSubscription(subscription)
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error)
    }
  }

  const subscribeToNotifications = async () => {
    setIsLoading(true)
    try {
      // Demander la permission
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready

        // Clé publique VAPID (à remplacer par votre vraie clé en production)
        const vapidKey = 'BDZPqRLkItU8JMQWnHOhZdQW6YBWZnqm_P4H_XlPzCU'

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        })

        setSubscription(subscription)
        setIsSubscribed(true)

        // Envoyer l'abonnement au serveur (simulation)
        console.log('Abonnement sauvegardé:', subscription)

        // Notification de confirmation
        showBrowserNotification(
          'ASH Radio - Notifications activées',
          'Vous recevrez maintenant nos dernières actualités !',
          '/icons/icon-192x192.png'
        )
      } else {
        alert('Permission refusée. Vous pouvez l\'activer dans les paramètres de votre navigateur.')
      }
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error)
      alert('Erreur lors de l\'activation des notifications.')
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true)
    try {
      if (subscription) {
        await subscription.unsubscribe()
        setSubscription(null)
        setIsSubscribed(false)

        showBrowserNotification(
          'ASH Radio - Notifications désactivées',
          'Vous ne recevrez plus nos notifications.',
          '/icons/icon-192x192.png'
        )
      }
    } catch (error) {
      console.error('Erreur lors de la désinscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      alert('Veuillez remplir le titre et le message.')
      return
    }

    setIsLoading(true)
    try {
      // Simuler l'envoi via service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready

        // Créer la notification
        await registration.showNotification(notificationTitle, {
          body: notificationMessage,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [200, 100, 200],
          data: {
            url: '/',
            timestamp: Date.now()
          },
          actions: [
            {
              action: 'listen',
              title: 'Écouter',
              icon: '/icons/radio-96x96.png'
            },
            {
              action: 'close',
              title: 'Fermer'
            }
          ]
        })

        // Ajouter à l'historique
        const newNotification: NotificationData = {
          id: Date.now().toString(),
          title: notificationTitle,
          message: notificationMessage,
          timestamp: new Date().toLocaleString('fr-FR'),
          sent: true,
          recipients: Math.floor(Math.random() * 2000) + 500
        }

        setNotifications([newNotification, ...notifications])
        setNotificationTitle('')
        setNotificationMessage('')

        alert('Notification envoyée avec succès !')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      alert('Erreur lors de l\'envoi de la notification.')
    } finally {
      setIsLoading(false)
    }
  }

  const showBrowserNotification = (title: string, body: string, icon: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon,
        vibrate: [200, 100, 200]
      })
    }
  }

  // Fonction utilitaire pour convertir la clé VAPID
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          <Bell className="w-8 h-8 inline-block mr-3 text-red-500" />
          Gestionnaire de Notifications Push
        </h1>
        <p className="text-gray-400">
          Gérez les notifications push pour informer vos auditeurs en temps réel
        </p>
      </div>

      {/* Statut d'abonnement */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            {isSubscribed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            Statut des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">
                {isSubscribed
                  ? 'Notifications activées - Vous recevrez les dernières actualités'
                  : 'Notifications désactivées - Activez pour recevoir nos actualités'
                }
              </p>
              <Badge className={`mt-2 ${isSubscribed ? 'bg-green-600' : 'bg-yellow-600'}`}>
                {isSubscribed ? 'Activé' : 'Désactivé'}
              </Badge>
            </div>
            <Button
              onClick={isSubscribed ? unsubscribeFromNotifications : subscribeToNotifications}
              disabled={isLoading}
              className={`${
                isSubscribed
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'ash-gradient hover:opacity-90'
              } transition-opacity`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSubscribed ? (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  Désactiver
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Activer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Envoyer une notification */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Send className="w-5 h-5 text-red-500" />
            Envoyer une Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre de la notification
            </label>
            <Input
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Ex: Nouvelle émission en direct"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              maxLength={50}
            />
            <span className="text-xs text-gray-500">
              {notificationTitle.length}/50 caractères
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <Textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Ex: Ne manquez pas notre émission spéciale qui commence maintenant !"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
              maxLength={200}
            />
            <span className="text-xs text-gray-500">
              {notificationMessage.length}/200 caractères
            </span>
          </div>

          <Button
            onClick={sendTestNotification}
            disabled={isLoading || !notificationTitle.trim() || !notificationMessage.trim()}
            className="w-full ash-gradient hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Envoyer la Notification
          </Button>
        </CardContent>
      </Card>

      {/* Historique des notifications */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MessageSquare className="w-5 h-5 text-red-500" />
            Historique des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{notification.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Envoyé
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{notification.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {notification.recipients.toLocaleString()} destinataires
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
