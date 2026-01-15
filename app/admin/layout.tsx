
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-muted/10">
            <AdminSidebar />
            <main className="md:ml-64 min-h-screen p-8">
                {children}
            </main>
        </div>
    )
}
