'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Menu,
  Radio,
  Music,
  Mic,
  Users,
  Headphones,
  MessageCircle,
  Calendar,
  Phone,
  Home
} from 'lucide-react'

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Musique', href: '/musique', icon: Music },
  { name: 'Émissions', href: '/emissions', icon: Radio },
  { name: 'Animateurs', href: '/animateurs', icon: Users },
  { name: 'Podcasts', href: '/podcasts', icon: Headphones },
  { name: 'Chatroom', href: '/chatroom', icon: MessageCircle },
  { name: 'Événements', href: '/evenements', icon: Calendar },
  { name: 'Contact', href: '/contact', icon: Phone },
]

const adminNavigation = [
  { name: 'Notifications', href: '/notifications', icon: MessageCircle },
  { name: 'Administration', href: '/admin', icon: Users },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full ash-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                ASH RADIO
              </span>
              <span className="text-xs text-gray-400 hidden sm:block">
                Votre station moderne
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Live Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-600/30">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-400">EN DIRECT</span>
            </div>

            {/* Listen Button */}
            <Button
              size="sm"
              className="hidden sm:flex ash-gradient hover:opacity-90 transition-opacity text-white font-medium"
            >
              <Mic className="w-4 h-4 mr-2" />
              Écouter
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-white hover:bg-white/10"
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-black/95 backdrop-blur-xl border-white/10">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full ash-gradient flex items-center justify-center">
                      <Radio className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">ASH RADIO</span>
                      <span className="text-xs text-gray-400">Votre station moderne</span>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                          >
                            <Icon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </nav>

                  {/* Mobile Actions */}
                  <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-600/30">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-medium text-red-400">EN DIRECT</span>
                    </div>

                    <Button
                      className="w-full ash-gradient hover:opacity-90 transition-opacity text-white font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Écouter en direct
                    </Button>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-4 pt-4">
                      {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                        <div
                          key={social}
                          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-red-600/20 transition-colors"
                        >
                          <span className="text-xs text-white">📱</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
