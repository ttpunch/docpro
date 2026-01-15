'use client'

import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { logVisit } from '@/actions/analytics'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
    const pathname = usePathname()
    const loggedRef = useRef(false)
    // To prevent double logging in React Strict Mode dev, use a session flag or ref
    // For simple unique visit tracking per session/page load.

    useEffect(() => {
        // Simple visitor ID stored in localStorage
        let visitorId = localStorage.getItem('visitor_id')
        if (!visitorId) {
            visitorId = uuidv4()
            localStorage.setItem('visitor_id', visitorId)
        }

        const log = async () => {
            // Basic debounce/check to avoid double firing in strict mode (optional but good for clean data)
            if (loggedRef.current) return
            // Don't log visits to admin pages
            if (pathname.startsWith('/admin')) return
            loggedRef.current = true

            await logVisit({
                visitor_id: visitorId!,
                path: pathname
            })
        }

        log()

        // Reset ref on path change if we want to track every page navigation as a visit?
        // Or just one visit per session? 
        // "Total site visits" usually implies page views or sessions. 
        // Let's implement page view tracking.
        loggedRef.current = false

    }, [pathname])

    return null
}
