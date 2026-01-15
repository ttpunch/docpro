
export async function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = URL.createObjectURL(file)
    })
}

// Support for react-easy-crop Area type
export type Area = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function cropImageToSpec(
    img: HTMLImageElement,
    specWidth: number,
    specHeight: number,
    cropArea?: Area // Should come from react-easy-crop
): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = specWidth
    canvas.height = specHeight
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('No context')

    // If cropArea is provided (Manual Crop), use it
    if (cropArea) {
        ctx.drawImage(
            img,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            specWidth,
            specHeight
        )
        return canvas
    }

    // Fallback: Default Center Crop (Original Logic)
    const imgAspect = img.width / img.height
    const specAspect = specWidth / specHeight

    let sx, sy, sw, sh

    if (imgAspect > specAspect) {
        sh = img.height
        sw = sh * specAspect
        sy = 0
        sx = (img.width - sw) / 2
    } else {
        sw = img.width
        sh = sw / specAspect
        sx = 0
        sy = (img.height - sh) / 2
    }

    // Rounding
    sx = Math.floor(sx)
    sy = Math.floor(sy)
    sw = Math.floor(sw)
    sh = Math.floor(sh)

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, specWidth, specHeight)
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, specWidth, specHeight)

    return canvas
}
