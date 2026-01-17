'use client'

import { usePresets } from '@/hooks/usePresets'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Camera, FileCheck, Download } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const { presets, requests, loading, error } = usePresets()
  const [search, setSearch] = useState('')

  const filtered = presets.filter(p =>
    p.display_name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full backdrop-blur-sm border-primary/20 bg-primary/10 text-primary animate-fade-in">
            ✨ 100% Private • Secure
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary font-black italic tracking-tighter">
              docpro:
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Perfect ID Photos, Instantly.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Stop struggling with complicated tools. Create compliant photos for any official document in seconds.
            <span className="block mt-4 text-sm font-medium text-primary/80 bg-primary/5 py-1 px-3 rounded-full inline-block">
              🔒 Your photos remain 100% on your device
            </span>
          </p>

          <div className="relative max-w-lg mx-auto mt-10">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for exam or document (e.g., UPSC, Visa)..."
              className="pl-10 h-12 text-lg rounded-full bg-background/50 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 focus:ring-2 ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>
      </section>

      {/* Presets Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading specifications...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">Error: {error}</div>
        ) : (<>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((preset, index) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/${preset.code}`}>
                  <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 group bg-card/50 backdrop-blur-sm cursor-pointer border-transparent ring-1 ring-border">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2">{preset.category.replace('_', ' ').toUpperCase()}</Badge>
                        <Camera className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{preset.display_name}</CardTitle>
                      <CardDescription>{preset.width_px}x{preset.height_px}px • {preset.background_color} bg</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {preset.description || `Generate a compliant ${preset.display_name} photo instantly.`}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}

            {/* "Coming Soon" Card */}
            {!search && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: filtered.length * 0.05 }}
              >
                <Card className="h-full border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center p-8 text-center transition-all duration-300">
                  <div className="bg-primary/10 p-4 rounded-full mb-4 ring-1 ring-primary/20">
                    <Camera className="h-8 w-8 text-primary/60" />
                  </div>
                  <CardTitle className="text-xl mb-2 text-foreground/70 tracking-tight">Expansion in Progress</CardTitle>
                  <p className="text-sm text-muted-foreground max-w-[200px] leading-relaxed">
                    New document formats, AI background removal, and more coming soon!
                  </p>
                  <Button variant="outline" className="mt-6 border-primary/30 text-primary hover:bg-primary/10" asChild>
                    <Link href="/request">Request a Feature</Link>
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Requested Features Section */}
          {requests && requests.length > 0 && (
            <div className="mt-20 user-request-section">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-8 w-1 bg-primary rounded-full"></div>
                <h2 className="text-3xl font-bold tracking-tight">Requested Features/Presets</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req, i) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                  >
                    <Card className="h-full bg-muted/30 border-primary/20 hover:border-primary/40 transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                            {req.type === 'preset' ? 'New Preset' : 'Feature'}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                            Implemented
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-3 text-base text-foreground/80">
                          "{req.description}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileCheck className="h-4 w-4" />
                          <span>Request fulfilled</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>)}
      </section>
    </div>
  )
}
