'use client'

import { PhotoSpec } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, AlertCircle, CheckCircle, Download, ArrowLeft, Loader2, Crop } from 'lucide-react'
import Link from 'next/link'
import { usePhotoProcessor } from '@/hooks/usePhotoProcessor'
import Cropper, { Area, Point } from 'react-easy-crop'

// To fix slider missing error, we might need to add Slider to shadcn components or use standard input range
// Assuming we don't have Slider yet, I'll use standard input range for now to be safe, can upgrade later.

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PhotoProcessor({ spec }: { spec: PhotoSpec }) {
    // Custom Spec State
    const [customWidth, setCustomWidth] = useState(spec.width_px)
    const [customHeight, setCustomHeight] = useState(spec.height_px)
    const [customMinSize, setCustomMinSize] = useState(spec.file_size_min_kb)
    const [customMaxSize, setCustomMaxSize] = useState(spec.file_size_max_kb)

    // Derived spec object that updates with custom values
    const effectiveSpec = {
        ...spec,
        width_px: customWidth,
        height_px: customHeight,
        file_size_min_kb: customMinSize,
        file_size_max_kb: customMaxSize,
        aspect_ratio: customWidth / customHeight
    }

    const [file, setFile] = useState<File | null>(null)
    const {
        processedImage,
        originalImage,
        loadFile,
        applyCrop,
        reset,
        revertToCrop,
        processing,
        error,
        initialZoom
    } = usePhotoProcessor(effectiveSpec)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Cropper State
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [quality, setQuality] = useState(0.92)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0]
            setFile(f)
            setZoom(1)
            loadFile(f)
        }
    }

    useEffect(() => {
        if (initialZoom > 1) {
            setZoom(initialZoom)
        }
    }, [initialZoom])

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleGenerate = async () => {
        if (croppedAreaPixels) {
            await applyCrop(croppedAreaPixels, quality)
        }
    }

    const handleReset = () => {
        setFile(null)
        reset()
        setCrop({ x: 0, y: 0 })
        setZoom(1)
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-6">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Presets
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{spec.display_name}</h1>
                    <p className="text-muted-foreground mt-1">{spec.description}</p>
                </div>
                {spec.type === 'custom' && (
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50 grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                        <div>
                            <Label htmlFor="width" className="text-xs text-muted-foreground">Width (px)</Label>
                            <Input
                                id="width"
                                type="number"
                                value={customWidth}
                                onChange={(e) => setCustomWidth(Number(e.target.value))}
                                className="h-8 mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="height" className="text-xs text-muted-foreground">Height (px)</Label>
                            <Input
                                id="height"
                                type="number"
                                value={customHeight}
                                onChange={(e) => setCustomHeight(Number(e.target.value))}
                                className="h-8 mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="minSize" className="text-xs text-muted-foreground">Min Size (KB)</Label>
                            <Input
                                id="minSize"
                                type="number"
                                value={customMinSize}
                                onChange={(e) => setCustomMinSize(Number(e.target.value))}
                                className="h-8 mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxSize" className="text-xs text-muted-foreground">Max Size (KB)</Label>
                            <Input
                                id="maxSize"
                                type="number"
                                value={customMaxSize}
                                onChange={(e) => setCustomMaxSize(Number(e.target.value))}
                                className="h-8 mt-1"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload / Preview Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-[600px] flex flex-col justify-center items-center border-dashed border-2 hover:border-primary/50 transition-colors bg-muted/20 overflow-hidden relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                        />

                        {!file ? (
                            <div className="text-center p-6">
                                <Upload className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
                                <Button
                                    size="lg"
                                    className="rounded-full shadow-lg hover:shadow-primary/25 transition-all"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Upload {spec.type === 'signature' ? 'Signature' : 'Photo'}
                                </Button>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    JPG, PNG or WEBP. Max 10MB.
                                </p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex flex-col bg-zinc-950/90">
                                {processing ? (
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                                        <p className="text-white font-medium">Processing...</p>
                                    </div>
                                ) : processedImage ? (
                                    // Step 3: Result View
                                    <div className="relative h-full p-8 flex flex-col items-center justify-center">
                                        <img
                                            src={processedImage}
                                            alt="Processed"
                                            className="max-h-[400px] shadow-2xl border-4 border-white mb-6"
                                        />
                                        <div className="flex gap-4">
                                            <Button variant="outline" onClick={() => revertToCrop()}>
                                                Adjust Crop
                                            </Button>
                                            <Button variant="secondary" onClick={() => {
                                                const link = document.createElement('a')
                                                link.href = processedImage
                                                link.download = `${spec.code}-photo.jpg`
                                                link.click()
                                            }}>
                                                <Download className="mr-2 h-4 w-4" /> Download Photo
                                            </Button>
                                        </div>
                                    </div>
                                ) : originalImage ? (
                                    // Step 2: Crop View
                                    <div className="flex-1 flex flex-col relative">
                                        <div className="relative flex-1 bg-zinc-900 w-full">
                                            <Cropper
                                                image={originalImage.src}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={effectiveSpec.aspect_ratio}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                                showGrid={true}
                                                objectFit="contain"
                                            />
                                        </div>
                                        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-white space-y-1 pointer-events-none">
                                            <div className="font-medium text-white/80 uppercase tracking-wider mb-2">Real-time Stats</div>
                                            <div className="flex justify-between gap-4"><span>Original:</span> <span className="font-mono">{originalImage.width} x {originalImage.height}</span></div>
                                            <div className="flex justify-between gap-4"><span>Target:</span> <span className="font-mono text-green-400">{customWidth} x {customHeight}</span></div>
                                        </div>
                                        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center gap-4 z-10">
                                            <div className="flex-1 flex flex-col gap-2">
                                                <div className="flex justify-between text-xs text-white/70">
                                                    <span>Zoom: {zoom.toFixed(1)}x</span>
                                                    <span>Quality: {(quality * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="flex gap-4">
                                                    <input
                                                        type="range"
                                                        min={1}
                                                        max={3}
                                                        step={0.1}
                                                        value={zoom}
                                                        onChange={(e) => setZoom(Number(e.target.value))}
                                                        className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                                    />
                                                    <input
                                                        type="range"
                                                        min={0.1}
                                                        max={1.0}
                                                        step={0.05}
                                                        value={quality}
                                                        onChange={(e) => setQuality(Number(e.target.value))}
                                                        className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                                    />
                                                </div>
                                            </div>
                                            <Button onClick={handleGenerate} disabled={!croppedAreaPixels}>
                                                <Crop className="mr-2 h-4 w-4" />
                                                Process
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-4 m-auto">
                                        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                                        <p className="text-red-400 font-medium">Error loading image</p>
                                        <p className="text-sm text-red-400/80 mt-1">{error}</p>
                                    </div>
                                )}

                                {file && !processedImage && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
                                        onClick={handleReset}
                                    >
                                        Start Over
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Requirements & Report */}
                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-lg">Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-muted-foreground">Dimensions</span>
                                <span className="font-mono font-medium">{effectiveSpec.width_px} × {effectiveSpec.height_px} px</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-muted-foreground">File Size</span>
                                <span className="font-mono font-medium">{effectiveSpec.file_size_min_kb} - {effectiveSpec.file_size_max_kb} KB</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-muted-foreground">Format</span>
                                <span className="font-mono font-medium">JPG / JPEG</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-muted-foreground">Background</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: spec.background_color }}></span>
                                    <span className="capitalize font-medium">{spec.background_color}</span>
                                </div>
                            </div>
                            {spec.type !== 'signature' && (
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-muted-foreground">Face Coverage</span>
                                    <span className="font-mono font-medium">{spec.face_coverage_min && spec.face_coverage_max ? `${(spec.face_coverage_min).toFixed(0)}% - ${(spec.face_coverage_max).toFixed(0)}%` : 'N/A'}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-medium text-primary">Privacy Note</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Your photo is processed 100% in your browser. It is never uploaded to our servers.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
