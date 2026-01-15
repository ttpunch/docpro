import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileImage, Activity, Users } from 'lucide-react'
import { AdminControls } from '@/components/admin/AdminControls'

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const resolvedParams = await searchParams
    const fromDate = typeof resolvedParams.from === 'string' ? resolvedParams.from : undefined
    const toDate = typeof resolvedParams.to === 'string' ? resolvedParams.to : undefined

    // Helper to apply date filter
    const applyDateFilter = (query: any) => {
        if (fromDate) query = query.gte('created_at', fromDate)
        if (toDate) query = query.lte('created_at', `${toDate}T23:59:59`)
        return query
    }

    // Fetch stats
    const { count: presetCount } = await supabase
        .from('photo_specs')
        .select('*', { count: 'exact', head: true })

    const { count: activePresetCount } = await supabase
        .from('photo_specs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    // New Stats (Time Filtered)
    let processedQuery = supabase.from('processing_logs').select('*', { count: 'exact', head: true })
    processedQuery = applyDateFilter(processedQuery)
    const { count: totalProcessed } = await processedQuery

    let failedQuery = supabase.from('processing_logs').select('*', { count: 'exact', head: true }).eq('status', 'error')
    failedQuery = applyDateFilter(failedQuery)
    const { count: failedProcessed } = await failedQuery

    let visitsQuery = supabase.from('site_visits').select('*', { count: 'exact', head: true })
    visitsQuery = applyDateFilter(visitsQuery)
    const { count: totalVisits } = await visitsQuery

    // Unique visitors - filtering using raw query logic isn't straightforward with Supabase JS client efficiently for unique count + filters
    // We will stick to fetching visitor_ids for the filtered range and counting set size.
    let visitorsQuery = supabase.from('site_visits').select('visitor_id')
    visitorsQuery = applyDateFilter(visitorsQuery)
    const { data: uniqueVisitorsData } = await visitorsQuery

    const uniqueVisitors = new Set(uniqueVisitorsData?.map(v => v.visitor_id)).size

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back to the docpro management panel.</p>
                </div>
                {/* Date range display or other header info could go here if needed */}
            </div>

            <AdminControls />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Presets</CardTitle>
                        <FileImage className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{presetCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            All defined photo specifications
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Presets</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activePresetCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently visible on home page
                        </p>
                    </CardContent>
                </Card>

                {/* New Stats Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniqueVisitors || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Distinct devices/browsers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Photos Processed</CardTitle>
                        <FileImage className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProcessed || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Success rate: {totalProcessed ? Math.round(((totalProcessed - (failedProcessed || 0)) / totalProcessed) * 100) : 0}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Site Visits</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisits || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total page loads
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
