import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PhotoProcessor from '@/components/user/PhotoProcessor'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
    props: { params: Promise<{ preset: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await props.params
    const supabase = await createClient()

    const { data: spec } = await supabase
        .from('photo_specs')
        .select('*')
        .eq('code', params.preset)
        .single()

    if (!spec) {
        return {
            title: 'Preset Not Found',
        }
    }

    return {
        title: `${spec.display_name} Generator`,
        description: `Create compliant ${spec.display_name} (${spec.width_px}x${spec.height_px}px) instantly. ${spec.description || ''}`,
        openGraph: {
            title: `${spec.display_name} Generator | docpro`,
            description: `Create compliant ${spec.display_name} (${spec.width_px}x${spec.height_px}px) instantly.`,
        },
    }
}

export default async function PresetPage(props: { params: Promise<{ preset: string }> }) {
    const params = await props.params;
    const supabase = await createClient()

    const { data: spec } = await supabase
        .from('photo_specs')
        .select('*')
        .eq('code', params.preset)
        .eq('is_current', true)
        .single()

    if (!spec) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <PhotoProcessor spec={spec} />
        </div>
    )
}
