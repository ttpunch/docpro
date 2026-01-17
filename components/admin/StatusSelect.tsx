"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface StatusSelectProps {
    requestId: string
    initialStatus: string
}

export function StatusSelect({ requestId, initialStatus }: StatusSelectProps) {
    const [status, setStatus] = useState(initialStatus)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === 'implemented') {
            const confirmed = window.confirm("Marking this request as 'Implemented' will display it publicly on the Home Page under 'Requested Features/Presets'.\n\nAre you sure you want to proceed?")
            if (!confirmed) return
        }

        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("feature_requests")
                .update({ status: newStatus })
                .eq("id", requestId)

            if (error) throw error

            setStatus(newStatus)
        } catch (error) {
            console.error("Error updating status:", error)
            alert("Failed to update status. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (currentStatus: string) => {
        switch (currentStatus) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
            case "reviewed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            case "implemented":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    return (
        <div className="relative inline-block w-32">
            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isLoading}
                className={`w-full appearance-none rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 ${getStatusColor(status)}`}
            >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="implemented">Implemented</option>
            </select>
            {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                </div>
            )}
        </div>
    )
}
