import { createClient } from "@/lib/supabase/server"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusSelect } from "@/components/admin/StatusSelect"
import { DeleteRequestButton } from "@/components/admin/DeleteRequestButton"

export default async function AdminRequestsPage() {
    const supabase = await createClient()

    const { data: requests, error } = await supabase
        .from("feature_requests")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                Error loading requests: {error.message}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Feature Requests</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Incoming Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests?.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={request.type === 'feature' ? 'default' : 'secondary'}>
                                                {request.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate" title={request.description}>
                                            {request.description}
                                        </TableCell>
                                        <TableCell>{request.email || "-"}</TableCell>
                                        <TableCell>
                                            <StatusSelect
                                                requestId={request.id}
                                                initialStatus={request.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <DeleteRequestButton requestId={request.id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
