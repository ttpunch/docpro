'use server'

import { createClient } from '@/lib/supabase/server'

export async function logProcessing(data: { spec_code: string; status: 'success' | 'error'; error_message?: string }) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from('processing_logs').insert({
            spec_code: data.spec_code,
            status: data.status,
            error_message: data.error_message,
        })

        if (error) {
            console.error('Error logging processing event:', error)
        }
    } catch (e) {
        console.error('Failed to log processing event:', e)
    }
}

export async function logVisit(data: { visitor_id: string; path: string }) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from('site_visits').insert({
            visitor_id: data.visitor_id,
            path: data.path,
        })

        if (error) {
            console.error('Error logging visit:', error)
        }
    } catch (e) {
        console.error('Failed to log visit:', e)
    }
}

export async function resetAnalytics() {
    // Use service role key to bypass RLS for admin action
    // We create a direct client here because we need privilege
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
        await supabase.from('processing_logs').delete().gt('created_at', '1970-01-01T00:00:00Z') // Delete all
        await supabase.from('site_visits').delete().gt('created_at', '1970-01-01T00:00:00Z') // Delete all
        return { success: true }
    } catch (e) {
        console.error('Failed to reset analytics:', e)
        return { success: false, error: 'Failed to reset analytics' }
    }
}
