import { useState } from 'react'
import { PhotoSpec } from '@/lib/types'
import { loadImage, cropImageToSpec, Area } from '@/lib/canvas/processor'
import { Point } from 'react-easy-crop'

export function usePhotoProcessor(spec: PhotoSpec) {
    const [processedImage, setProcessedImage] = useState<string | null>(null)
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
    const [initialCrop, setInitialCrop] = useState<Point>({ x: 0, y: 0 })
    const [initialZoom, setInitialZoom] = useState(1)

    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Stage 1: Load file
    async function loadFile(file: File) {
        setProcessing(true)
        setError(null)
        setProcessedImage(null) // Reset previous
        try {
            const img = await loadImage(file)
            setOriginalImage(img)
            setInitialZoom(1)
        } catch (e: any) {
            console.error('Photo loading error:', e)
            setError(e.message || "Failed to load image")
        } finally {
            setProcessing(false)
        }
    }

    // Stage 2: Apply Crop
    async function applyCrop(cropArea: Area, quality: number = 0.92) {
        if (!originalImage) return

        setProcessing(true)
        try {
            await new Promise(r => setTimeout(r, 100))
            const canvas = cropImageToSpec(originalImage, spec.width_px, spec.height_px, cropArea)
            setProcessedImage(canvas.toDataURL('image/jpeg', quality))

            // Log success
            try {
                // Dynamic import to avoid server-action issues in client components not marked 'use client' if imported directly, 
                // though usually imports are fine. Safe to import directly if 'actions/analytics' is 'use server'.
                // Using direct import at top of file is better practice if possible.
                const { logProcessing } = await import('@/actions/analytics')
                logProcessing({ spec_code: spec.code, status: 'success' })
            } catch (logError) {
                console.error("Failed to log success:", logError)
            }

        } catch (e: any) {
            console.error('Crop error:', e)
            setError("Failed to apply crop")

            // Log error
            try {
                const { logProcessing } = await import('@/actions/analytics')
                logProcessing({ spec_code: spec.code, status: 'error', error_message: e.message || "Unknown error" })
            } catch (logError) {
                console.error("Failed to log error:", logError)
            }
        } finally {
            setProcessing(false)
        }
    }

    const reset = () => {
        setProcessedImage(null)
        setOriginalImage(null)
        setError(null)
        setInitialZoom(1)
        setInitialCrop({ x: 0, y: 0 })
    }

    const revertToCrop = () => {
        setProcessedImage(null)
        setError(null)
    }

    return {
        processedImage,
        originalImage,
        loadFile,
        applyCrop,
        reset,
        revertToCrop,
        processing,
        error,
        initialCrop,
        initialZoom
    }
}
