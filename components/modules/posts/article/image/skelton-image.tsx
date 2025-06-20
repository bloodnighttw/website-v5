import { generateBlurredDataUrl } from "@/utils/generate-blur-data-url";
import { ImageProps } from "next/image";
import "server-only"
import ArticleImage from "./image";

interface SkeletonImageProps extends ImageProps {
    src: string;
}

export default async function SkeltonImage(props:SkeletonImageProps) {

    // get the image from the props and blur it
    const { src } = props;

    const blurEncodedImage = await generateBlurredDataUrl(src);

    return <ArticleImage
        {...props}
        blur={blurEncodedImage}
    />
}