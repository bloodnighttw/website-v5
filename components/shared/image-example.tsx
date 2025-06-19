import SkeletonImage from './image';

// Example usage of the SkeletonImage component
export function ImageExample() {
    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Image with Auto-Generated Blur Placeholder</h2>
            
            <SkeletonImage
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                alt="Beautiful landscape"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
            />
            
            <p className="mt-4 text-sm text-gray-600">
                This image automatically generates a small, blurred version as a placeholder
                while the full image loads. The placeholder is created as a data URL.
            </p>
        </div>
    );
}
