import Image, { type ImageProps } from "next/image";

async function generateBlurredDataUrl(imageSrc: string): Promise<string> {
    try {
        // For server-side rendering, we'll use sharp for image processing
        if (typeof window === 'undefined') {
            try {
                // Dynamic import for sharp to avoid issues
                const sharp = (await import('sharp')).default;
                
                // Fetch the image
                const response = await fetch(imageSrc);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.statusText}`);
                }
                
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                const resizedBuffer = await sharp(buffer)
                    .resize(10, 10, { fit: 'cover' }) // Very small size for blur effect
                    .blur(1)
                    .jpeg({ quality: 70 })
                    .toBuffer();
                
                const base64 = resizedBuffer.toString('base64');
                return `data:image/jpeg;base64,${base64}`;
            } catch (error) {
                console.warn('Sharp processing failed, using fallback:', error);
                return getFallbackDataUrl();
            }
        } else {
            // Client-side: Use Canvas API
            return new Promise<string>((resolve) => {
                const img = new globalThis.Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    if (!ctx) {
                        resolve(getFallbackDataUrl());
                        return;
                    }
                    
                    // Set small canvas size for blur effect
                    canvas.width = 10;
                    canvas.height = 10;
                    
                    // Apply blur filter
                    ctx.filter = 'blur(1px)';
                    
                    // Draw the image scaled down
                    ctx.drawImage(img, 0, 0, 10, 10);
                    
                    // Convert to data URL
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                
                img.onerror = () => {
                    resolve(getFallbackDataUrl());
                };
                
                img.src = imageSrc;
            });
        }
    } catch (error) {
        console.error('Error generating blurred data URL:', error);
        return getFallbackDataUrl();
    }
}

function getFallbackDataUrl(): string {
    const svg = '<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#e5e7eb"/></svg>';
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

interface SkeletonImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
    src: string;
}

export default async function SkeletonImage(props: SkeletonImageProps) {
    const { src, alt, className, ...rest } = props;

    // Generate a blurred data URL from the actual image source
    const blurredDataUrl = await generateBlurredDataUrl(src);

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            placeholder="blur"
            blurDataURL={blurredDataUrl}
            {...rest}
        />
    );
}