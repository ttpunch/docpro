
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const dlSpecs = [
    {
        code: 'dl_india_photo',
        version: 1,
        display_name: 'Driving License Request (India) - Photo',
        description: 'Parivahan / Sarathi formal photo. 35x45mm, 10-20KB.',
        type: 'photo',
        category: 'govt_id',
        width_px: 413, // ~35mm at 300dpi
        height_px: 531, // ~45mm at 300dpi
        aspect_ratio: 35 / 45,
        file_size_min_kb: 10,
        file_size_max_kb: 20,
        file_format: 'jpeg',
        background_color: 'white',
        face_coverage_min: 70,
        face_coverage_max: 80,
        is_active: true,
        sort_order: 15,
        created_at: new Date().toISOString()
    },
    {
        code: 'dl_india_sig',
        version: 1,
        display_name: 'Driving License Request (India) - Signature',
        description: 'Parivahan / Sarathi formal signature. 30x10mm, 10-20KB.',
        type: 'signature',
        category: 'govt_id',
        width_px: 354, // ~30mm at 300dpi
        height_px: 118, // ~10mm at 300dpi
        aspect_ratio: 30 / 10,
        file_size_min_kb: 10,
        file_size_max_kb: 20,
        file_format: 'jpeg',
        background_color: 'white',
        face_coverage_min: 0,
        face_coverage_max: 0,
        is_active: true,
        sort_order: 16,
        created_at: new Date().toISOString()
    }
]

async function seedDL() {
    console.log('Seeding Driving License presets...')

    for (const spec of dlSpecs) {
        const { error } = await supabase
            .from('photo_specs')
            .upsert(spec, { onConflict: 'code', ignoreDuplicates: false })

        if (error) {
            console.error(`Error inserting ${spec.code}:`, error)
        } else {
            console.log(`Successfully inserted/updated: ${spec.display_name}`)
        }
    }

    console.log('Driving License seeding complete!')
}

seedDL()
