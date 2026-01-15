export type PhotoSpec = {
    id: string
    code: string
    version: number
    display_name: string
    type?: 'photo' | 'signature' | 'custom'
    category: 'central_exam' | 'state_exam' | 'govt_id' | 'visa' | 'other'
    width_px: number
    height_px: number
    aspect_ratio: number
    file_size_min_kb: number
    file_size_max_kb: number
    background_color: string
    background_tolerance: number
    face_coverage_min: number
    face_coverage_max: number
    extras: Record<string, any>
    description?: string
    portal_url?: string
    source_url?: string
    is_active?: boolean
    updated_at: string
}
