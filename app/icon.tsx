import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}

export const dynamic = "force-static"

export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
        <img src={"https://avatars.githubusercontent.com/u/44264182"} alt='avatar' style={{
            borderRadius: '50%',
            width: '100%',
            height: '100%',
        }} />
            
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}