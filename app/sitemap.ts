import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://id-photo-generator.vercel.app'

    // Fetch all active presets
    const { data: presets } = await supabase
        .from('photo_specs')
        .select('code, created_at')
        .eq('is_active', true)

    const presetUrls = (presets || []).map((preset) => ({
        url: `${baseUrl}/${preset.code}`,
        lastModified: new Date(preset.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...presetUrls,
    ]
}
