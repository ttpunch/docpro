"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface DeleteRequestButtonProps {
    requestId: string
}

export function DeleteRequestButton({ requestId }: DeleteRequestButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this feature request? This action cannot be undone.")
        if (!confirmed) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from("feature_requests")
                .delete()
                .eq("id", requestId)

            if (error) throw error

            router.refresh()
        } catch (error) {
            console.error("Error deleting request:", error)
            alert("Failed to delete request. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete Request"
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    )
}
