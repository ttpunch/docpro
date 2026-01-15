
import { createClient } from '@/lib/supabase/server'
import { PresetForm } from "@/components/admin/PresetForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from 'next/navigation'

export default async function EditPresetPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: preset, error } = await supabase
        .from('photo_specs')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !preset) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/presets">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Preset</h1>
                    <p className="text-muted-foreground">Modify photo requirements.</p>
                </div>
            </div>

            <div className="mx-auto">
                <PresetForm initialData={preset} />
            </div>
        </div>
    )
}
