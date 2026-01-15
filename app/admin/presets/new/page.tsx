
import { PresetForm } from "@/components/admin/PresetForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewPresetPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/presets">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Preset</h1>
                    <p className="text-muted-foreground">Add a new photo specification.</p>
                </div>
            </div>

            <div className="mx-auto">
                <PresetForm />
            </div>
        </div>
    )
}
