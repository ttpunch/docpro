import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Database } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background py-10 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                1. Core Privacy Promise
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                At docpro, we prioritize your privacy above all else. Unlike other online tools,
                                <strong> we do not upload your photos to our servers for processing.</strong>
                            </p>
                            <p>
                                All image cropping, resizing, and processing happens entirely <strong>locally on your device</strong> (in your web browser).
                                Your personal photos never leave your computer or phone.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-primary" />
                                2. Data Collection
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>We collect minimal anonymous data to help us improve the service:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Usage Statistics:</strong> We track which photo presets are generated (e.g., "generated a 2x2 photo") to understand popular formats. This data is not linked to any personal identity.</li>
                                <li><strong>Site Visits:</strong> We count page visits to monitor traffic.</li>
                                <li><strong>Error Logs:</strong> If processing fails, we log the error message to help us fix bugs. No image data is included in these logs.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                3. Local Storage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                We use your browser&apos;s "Local Storage" to save your preference (like Dark Mode) and assign a random anonymous visitor ID.
                                You can clear this data at any time by clearing your browser cache.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
