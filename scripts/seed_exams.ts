
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read env file manually to avoid dotenv dependency
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.split('='))
)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const PRESETS = [
    {
        code: 'upsc-civil-services',
        display_name: 'UPSC Civil Services',
        category: 'civil_services',
        width_px: 350,
        height_px: 350,
        aspect_ratio: 1,
        file_size_min_kb: 20,
        file_size_max_kb: 300,
        background_color: 'white',
        face_coverage_min: 50,
        face_coverage_max: 70,
        description: 'Photo for UPSC Civil Services Application. Requires clear visibility of face and simple background.',
        source_url: 'https://upsc.gov.in',
        is_active: true
    },
    {
        code: 'ssc-cgl',
        display_name: 'SSC CGL / CHSL',
        category: 'ssc',
        width_px: 350,
        height_px: 450,
        aspect_ratio: 0.77,
        file_size_min_kb: 20,
        file_size_max_kb: 50,
        background_color: 'white',
        face_coverage_min: 50,
        face_coverage_max: 70,
        description: 'Standard photo for Staff Selection Commission exams (CGL, CHSL, MTS).',
        source_url: 'https://ssc.nic.in',
        is_active: true
    },
    {
        code: 'neet-ug',
        display_name: 'NEET UG (Passport)',
        category: 'entrance_exam',
        width_px: 413, // 3.5cm at 300dpi
        height_px: 531, // 4.5cm at 300dpi
        aspect_ratio: 0.77,
        file_size_min_kb: 10,
        file_size_max_kb: 200,
        background_color: 'white',
        face_coverage_min: 80,
        face_coverage_max: 90,
        description: 'Passport size photo for NEET UG application. White background, ears visible.',
        source_url: 'https://neet.nta.nic.in',
        is_active: true
    },
    {
        code: 'jee-main',
        display_name: 'JEE Main',
        category: 'entrance_exam',
        width_px: 413, // 3.5cm
        height_px: 531, // 4.5cm
        aspect_ratio: 0.77,
        file_size_min_kb: 10,
        file_size_max_kb: 200,
        background_color: 'white',
        face_coverage_min: 50,
        face_coverage_max: 80,
        description: 'Recent photograph for JEE Main form. White background preferred.',
        source_url: 'https://jeemain.nta.nic.in',
        is_active: true
    },
    {
        code: 'gate',
        display_name: 'GATE Exam',
        category: 'entrance_exam',
        width_px: 480,
        height_px: 640,
        aspect_ratio: 0.75,
        file_size_min_kb: 5,
        file_size_max_kb: 200,
        background_color: 'white',
        face_coverage_min: 60,
        face_coverage_max: 75,
        description: 'Graduate Aptitude Test in Engineering. Good contrast required.',
        source_url: 'https://gate.iitk.ac.in',
        is_active: true
    },
    {
        code: 'ibps-po',
        display_name: 'IBPS PO / Clerk',
        category: 'banking',
        width_px: 413, // 4.5cm x 3.5cm
        height_px: 531,
        aspect_ratio: 0.77,
        file_size_min_kb: 20,
        file_size_max_kb: 50,
        background_color: 'white',
        face_coverage_min: 60,
        face_coverage_max: 80,
        description: 'Common photo format for various banking exams (IBPS, SBI).',
        source_url: 'https://ibps.in',
        is_active: true
    }
]

async function seed() {
    console.log('🌱 Seeding exams...')

    for (const preset of PRESETS) {
        const { error } = await supabase
            .from('photo_specs')
            .upsert(preset, { onConflict: 'code' })

        if (error) {
            console.error(`❌ Failed to insert ${preset.code}:`, error.message)
        } else {
            console.log(`✅ Upserted ${preset.display_name}`)
        }
    }

    console.log('✨ Seeding complete!')
}

seed()
