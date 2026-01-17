import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PhotoSpec } from '@/lib/types'

export function usePresets() {
    const [presets, setPresets] = useState<PhotoSpec[]>([])
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            // Fetch Presets
            const { data: presetsData, error: presetsError } = await supabase
                .from('photo_specs')
                .select('*')
                .eq('is_current', true)
                .eq('is_active', true)
                .order('sort_order', { ascending: true })

            // Fetch Implemented Requests
            const { data: requestsData, error: requestsError } = await supabase
                .from('feature_requests')
                .select('*')
                .eq('status', 'implemented')
                .order('created_at', { ascending: false })
                .limit(6)

            if (presetsError || requestsError) {
                setError(presetsError?.message || requestsError?.message || 'Error fetching data')
            } else {
                setPresets(presetsData as PhotoSpec[])
                setRequests(requestsData || [])
            }
            setLoading(false)
        }

        fetchData()
    }, [])

    return { presets, requests, loading, error }
}
