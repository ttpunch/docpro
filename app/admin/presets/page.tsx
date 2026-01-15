
import { createClient } from '@/lib/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function PresetsPage() {
    const supabase = await createClient()
    const { data: presets } = await supabase
        .from('photo_specs')
        .select('*')
        .order('display_name', { ascending: true })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Presets</h1>
                    <p className="text-muted-foreground">Manage photo specifications and their requirements.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/presets/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Dimensions</TableHead>
                            <TableHead>Required Size</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {presets?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No presets found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            presets?.map((preset) => (
                                <TableRow key={preset.id}>
                                    <TableCell className="font-medium">
                                        {preset.display_name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {preset.code}
                                    </TableCell>
                                    <TableCell>
                                        {preset.width_px} x {preset.height_px} px
                                    </TableCell>
                                    <TableCell>
                                        {preset.file_size_min_kb}-{preset.file_size_max_kb} KB
                                    </TableCell>
                                    <TableCell>
                                        {preset.is_active ? (
                                            <Badge variant="default" className="bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/presets/${preset.id}`}>
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
