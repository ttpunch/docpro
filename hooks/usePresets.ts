import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PhotoSpec } from '@/lib/types'

export function usePresets() {
    const [presets, setPresets] = useState<PhotoSpec[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPresets() {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('photo_specs')
                .select('*')
                .eq('is_current', true)
                .eq('is_active', true)
                .order('sort_order', { ascending: true })

            if (error) {
                setError(error.message)
            } else {
                setPresets(data as PhotoSpec[])
            }
            setLoading(false)
        }

        fetchPresets()
    }, [])

    return { presets, loading, error }
}
