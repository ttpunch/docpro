import { FeatureRequestForm } from "@/components/features/FeatureRequestForm"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Request Feature | docpro",
    description: "Submit feature requests or ask for new document presets to be added to docpro.",
}

export default function RequestPage() {
    return (
        <div className="min-h-screen bg-background py-20 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-background to-background">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Help Us Improve</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We are constantly adding new presets and features. Your feedback helps us prioritize what to build next.
                    </p>
                </div>

                <FeatureRequestForm />
            </div>
        </div>
    )
}
