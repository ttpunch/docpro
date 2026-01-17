'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, FileImage, LogOut, Settings, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Presets', href: '/admin/presets', icon: FileImage },
    { name: 'Requests', href: '/admin/requests', icon: MessageSquare },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <aside className="w-64 border-r bg-muted/20 hidden md:flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Button
                            key={item.href}
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", isActive && "bg-secondary")}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        </Button>
                    )
                })}
            </nav>

            <div className="p-4 border-t space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-950/20"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    )
}
