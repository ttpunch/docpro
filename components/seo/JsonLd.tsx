export const JsonLd = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "docpro",
        "description": "Generate compliant ID photos for UPSC, SSC, Visas, and Passports instantly in your browser.",
        "url": "https://docpro.techdevpro.in",
        "applicationCategory": "PhotoEditor",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Automatic face detection",
            "Official photo specifications",
            "Privacy-focused (local processing)",
            "Instant cropping and resizing"
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
