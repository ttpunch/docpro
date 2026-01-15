
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read env file manually
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
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Common signature specs
const COMMON_SIG_W = 140
const COMMON_SIG_H = 60
const COMMON_SIG_SIZE_MIN = 10
const COMMON_SIG_SIZE_MAX = 20

const signatures = [
    // Central Exams
    {
        code: 'upsc-civil-services-sig',
        display_name: 'UPSC Signature',
        type: 'signature',
        category: 'civil_services',
        width_px: 350,
        height_px: 150, // estimated based on 3.5:1.5 ratio but higher res requirement
        aspect_ratio: 2.33,
        file_size_min_kb: 20,
        file_size_max_kb: 100,
        background_color: 'white',
        description: 'Signature for UPSC. Black ink on white paper.',
        source_url: 'https://upsc.gov.in'
    },
    {
        code: 'ssc-cgl-sig',
        display_name: 'SSC Signature',
        type: 'signature',
        category: 'ssc',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 10,
        file_size_max_kb: 20,
        background_color: 'white',
        description: 'Common signature format for SSC exams.',
        source_url: 'https://ssc.nic.in'
    },
    {
        code: 'neet-ug-sig',
        display_name: 'NEET UG Signature',
        type: 'signature',
        category: 'entrance_exam',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 4,
        file_size_max_kb: 30,
        background_color: 'white',
        description: 'Black ballpoint pen on white paper.',
        source_url: 'https://neet.nta.nic.in'
    },
    {
        code: 'jee-main-sig',
        display_name: 'JEE Main Signature',
        type: 'signature',
        category: 'entrance_exam',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 4,
        file_size_max_kb: 30,
        background_color: 'white',
        description: 'Signature for JEE Main.',
        source_url: 'https://jeemain.nta.nic.in'
    },
    {
        code: 'gate-sig',
        display_name: 'GATE Signature',
        type: 'signature',
        category: 'entrance_exam',
        width_px: 250,
        height_px: 80,
        aspect_ratio: 3.125,
        file_size_min_kb: 5,
        file_size_max_kb: 200,
        background_color: 'white',
        description: '2cm x 7cm box. Black or dark blue ink.',
        source_url: 'https://gate.iitk.ac.in'
    },
    {
        code: 'ibps-po-sig',
        display_name: 'IBPS / Bank Signature',
        type: 'signature',
        category: 'banking',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 10,
        file_size_max_kb: 20,
        background_color: 'white',
        description: 'Black ink on white paper. No capitals.',
        source_url: 'https://ibps.in'
    },
    {
        code: 'rrb-railway-sig',
        display_name: 'RRB / Railway Signature',
        type: 'signature',
        category: 'central_exam',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 10,
        file_size_max_kb: 20,
        background_color: 'white',
        description: 'Signature for Railway Recruitment Board.',
        source_url: 'https://indianrailways.gov.in'
    },
    {
        code: 'cat-mba-sig',
        display_name: 'CAT Signature',
        type: 'signature',
        category: 'entrance_exam',
        width_px: 300, // 80mm
        height_px: 130, // 35mm
        aspect_ratio: 2.28,
        file_size_min_kb: 10,
        file_size_max_kb: 80,
        background_color: 'white',
        description: 'Running handwriting, dark blue or black pen.',
        source_url: 'https://iimcat.ac.in'
    },
    // State PSCs & Schools (using standard 3.5x1.5cm / 140x60px default unless specified)
    {
        code: 'uppsc-up-sig',
        display_name: 'UPPSC Signature',
        type: 'signature',
        category: 'state_exam',
        width_px: 150, // 3.5cm
        height_px: 65,  // 1.5cm
        aspect_ratio: 2.3,
        file_size_min_kb: 10,
        file_size_max_kb: 20,
        background_color: 'white',
        description: 'Black or Blue ink.',
        source_url: 'https://uppsc.up.nic.in'
    },
    {
        code: 'bpsc-bihar-sig',
        display_name: 'BPSC Signature',
        type: 'signature',
        category: 'state_exam',
        width_px: 220,
        height_px: 100,
        aspect_ratio: 2.2,
        file_size_min_kb: 5,
        file_size_max_kb: 15,
        background_color: 'white',
        description: 'Maximum 15KB size.',
        source_url: 'https://bpsc.bih.nic.in'
    },
    {
        code: 'mpsc-maharashtra-sig',
        display_name: 'MPSC Signature',
        type: 'signature',
        category: 'state_exam',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 5,
        file_size_max_kb: 50,
        background_color: 'white',
        source_url: 'https://mpsc.gov.in'
    },
    {
        code: 'kpsc-kerala-sig',
        display_name: 'KPSC Signature',
        type: 'signature',
        category: 'state_exam',
        width_px: 150,
        height_px: 100,
        aspect_ratio: 1.5,
        file_size_min_kb: 5,
        file_size_max_kb: 30,
        background_color: 'white',
        description: '150px width x 100px height mandated.',
        source_url: 'https://keralapsc.gov.in'
    },
    {
        code: 'rpsc-rajasthan-sig',
        display_name: 'RPSC Signature',
        type: 'signature',
        category: 'state_exam',
        width_px: 280,
        height_px: 80,
        aspect_ratio: 3.5,
        file_size_min_kb: 20,
        file_size_max_kb: 50,
        background_color: 'white',
        description: '7cm x 2cm box equivalent.',
        source_url: 'https://rpsc.rajasthan.gov.in'
    },
    {
        code: 'cbse-board-sig',
        display_name: 'CBSE Signature',
        type: 'signature',
        category: 'entrance_exam',
        width_px: 140,
        height_px: 60,
        aspect_ratio: 2.33,
        file_size_min_kb: 4,
        file_size_max_kb: 30,
        background_color: 'white',
        source_url: 'https://cbse.gov.in'
    }
]

async function seedSignatures() {
    console.log('✍️ Seeding signatures...')

    for (const sig of signatures) {
        const { error } = await supabase
            .from('photo_specs')
            .upsert({
                ...sig,
                is_active: true,
                version: 1,
                effective_from: new Date().toISOString(),
                is_current: true,
                face_coverage_min: 0, // No face needed
                face_coverage_max: 0
            }, { onConflict: 'code' })

        if (error) {
            console.error(`❌ Failed ${sig.code}:`, error.message)
        } else {
            console.log(`✅ Upserted ${sig.display_name}`)
        }
    }
}

seedSignatures()
