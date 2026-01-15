'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Filter } from 'lucide-react'
import { resetAnalytics } from '@/actions/analytics'

export function AdminControls() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(searchParams.get('from') || '')
    const [endDate, setEndDate] = useState(searchParams.get('to') || '')
    const [isResetting, setIsResetting] = useState(false)

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams)
        if (startDate) params.set('from', startDate)
        else params.delete('from')

        if (endDate) params.set('to', endDate)
        else params.delete('to')

        router.push(`/admin?${params.toString()}`)
    }

    const handleReset = async () => {
        if (!confirm('Are you sure you want to delete ALL analytics data? This cannot be undone.')) return

        setIsResetting(true)
        try {
            const result = await resetAnalytics()
            if (result.success) {
                router.refresh()
                alert('Analytics data cleared.')
            } else {
                alert('Failed to clear data.')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred.')
        } finally {
            setIsResetting(false)
        }
    }

    return (
        <div className="bg-card border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center w-full md:w-auto">
                <div className="grid gap-1.5">
                    <Label htmlFor="from">From Date</Label>
                    <Input
                        id="from"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full md:w-[160px]"
                    />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="to">To Date</Label>
                    <Input
                        id="to"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full md:w-[160px]"
                    />
                </div>
                <Button variant="secondary" onClick={handleFilter}>
                    <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                {(startDate || endDate) && (
                    <Button variant="ghost" onClick={() => {
                        setStartDate('')
                        setEndDate('')
                        router.push('/admin')
                    }}>
                        Clear Filter
                    </Button>
                )}
            </div>

            <Button variant="destructive" onClick={handleReset} disabled={isResetting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isResetting ? 'Resetting...' : 'Reset Stats'}
            </Button>
        </div>
    )
}
