// components/common/image-manager/ThumbnailSlide.tsx
import { useState, useEffect } from "react";
import {isVideoUrl, optimizeImage} from "../../../utils/imageUtils.ts";

interface Props {
    urls: string[];
    className?: string; // 이미지에 적용할 클래스 (크기, object-fit 등)
    intervalMs?: number;
    transitionMs?: number;
    optimizeWidth?: number;
}

export default function ThumbnailSlide({
                                           urls,
                                           className = "",
                                           intervalMs = 2000,
                                           transitionMs = 2500,
                                           optimizeWidth,
}: Props) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (urls.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % urls.length);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [urls.length, intervalMs]);

    useEffect(() => {
        if (index >= urls.length) setIndex(0);
    }, [urls.length, index]);

    if (!urls || urls.length === 0) return null;

    return (
        <div className="relative w-full h-full overflow-hidden">
            {urls.map((url, i) => {
                const isVideo = isVideoUrl(url);
                // 동영상은 최적화 함수를 적용하지 않고, 이미지에만 적용
                const src = !isVideo && optimizeWidth ? optimizeImage(url, optimizeWidth) : url;
                return isVideo ? (
                <video
                key={url + i}
                src={src}
                className={`absolute inset-0 transition-opacity ease-in-out ${className}`}
                style={{
                    transitionDuration: `${transitionMs}ms`,
                    opacity: i === index ? 1 : 0,
                }}
                autoPlay
                muted
                loop
                playsInline
            />
        ) : (
            <img
                key={url + i}
                src={src}
                alt=""
                className={`absolute inset-0 transition-opacity ease-in-out ${className}`}
                style={{
                    transitionDuration: `${transitionMs}ms`,
                    opacity: i === index ? 1 : 0,
                }}
            />
        );
    })}
    </div>
    );
}