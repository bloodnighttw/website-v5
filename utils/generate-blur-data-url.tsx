import sharp from "sharp";

function getFallbackDataUrl(): string {
	const svg =
		'<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#e5e7eb"/></svg>';
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function generateBlurredDataUrl(imageSrc: string): Promise<string> {
	try {

		// Fetch the image
		const response = await fetch(imageSrc);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Get original image metadata to preserve aspect ratio
		const metadata = await sharp(buffer).metadata();
		const { width, height } = metadata;
		
		// Calculate new dimensions while preserving aspect ratio
		// Use the smaller dimension as base (10px) and scale the other proportionally
		let newWidth: number, newHeight: number;
		if (width && height) {
			const aspectRatio = width / height;
			if (aspectRatio > 1) {
				// Landscape: height = 10, width proportional
				newHeight = 40;
				newWidth = Math.round(40 * aspectRatio);
			} else {
				// Portrait or square: width = 10, height proportional
				newWidth = 40;
				newHeight = Math.round(40 / aspectRatio);
			}
		} else {
			// Fallback if metadata is unavailable
			newWidth = 10;
			newHeight = 10;
		}

		const resizedBuffer = await sharp(buffer)
			.resize(newWidth, newHeight, { fit: "inside" }) // Preserve aspect ratio
			.blur(1)
			.jpeg({ quality: 70 })
			.toBuffer();

		const base64 = resizedBuffer.toString("base64");
		return `data:image/jpeg;base64,${base64}`;
	} catch (error) {
		console.warn("Sharp processing failed, using fallback:", error);
		return getFallbackDataUrl();
	}
}
