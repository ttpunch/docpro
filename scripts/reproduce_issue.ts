
import { cropImageToSpec } from '../lib/canvas/processor';
import { JSDOM } from 'jsdom';
import { createCanvas, Image } from 'canvas';

// Mock Browser Environment
const dom = new JSDOM();
global.document = dom.window.document;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.HTMLImageElement = dom.window.HTMLImageElement;

global.document.createElement = (tagName: string) => {
    if (tagName === 'canvas') {
        return createCanvas(100, 100) as any;
    }
    return dom.window.document.createElement(tagName);
};

async function testCrop() {
    console.log("Starting Crop Logic Test...");

    // Helper to create a source "image" (using canvas for node env)
    const createMockImage = (w: number, h: number) => {
        const cvs = createCanvas(w, h);
        const ctx = cvs.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, w, h);
        // In node-canvas/jsdom interaction, passing a canvas to drawImage is valid and synchronous
        return cvs as any;
    };

    // Case 1: Landscape Image (1000x500) -> Portrait Spec (350x450)
    try {
        const img = createMockImage(1000, 500);
        // Manually set dims so our processor can read them (usually standard on HTMLImageElement)
        img.width = 1000;
        img.height = 500;

        const specWidth = 350;
        const specHeight = 450;

        console.log(`\nTest 1: Landscape Image (${img.width}x${img.height}) -> Spec (${specWidth}x${specHeight})`);

        const canvas = cropImageToSpec(img, specWidth, specHeight);

        console.log("Result Canvas:", canvas.width, "x", canvas.height);

        // Check pixel at center - should be red
        const ctx = canvas.getContext('2d') as any; // cast to any for node-canvas methods
        const pixel = ctx.getImageData(specWidth / 2, specHeight / 2, 1, 1).data;
        if (pixel[0] > 200) {
            console.log("PASS: Canvas contains image data (Red pixel found)");
        } else {
            console.error("FAIL: Canvas is empty or white");
        }

    } catch (e) {
        console.error("FAIL: Exception thrown", e);
    }

    // Case 2: Portrait Image (500x1000) -> Portrait Spec (350x450)
    try {
        const img2 = createMockImage(500, 1000);
        img2.width = 500;
        img2.height = 1000;

        const specWidth = 350;
        const specHeight = 450;

        console.log(`\nTest 2: Portrait Image (${img2.width}x${img2.height}) -> Spec (${specWidth}x${specHeight})`);

        const canvas2 = cropImageToSpec(img2, specWidth, specHeight);
        console.log("PASS: Completed without error");
    } catch (e) {
        console.error("FAIL: Exception thrown", e);
    }
}

testCrop();
