// components/common/image-manager/ThumbnailSlide.tsx
import { useState, useEffect } from "react";
import { isVideoUrl } from "../../../utils/imageUtils.ts";

interface Props {
    urls: string[];
    className?: string; // 이미지에 적용할 클래스 (크기, object-fit 등)
    intervalMs?: number;
}

export default function ThumbnailSlide({ urls, className = "", intervalMs = 2000 }: Props) {
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
            {urls.map((url, i) =>
                isVideoUrl(url) ? (
                    <video
                        key={url + i}
                        src={url}
                        className={`absolute inset-0 transition-opacity duration-[1000ms] ${
                            i === index ? "opacity-100" : "opacity-0"
                        } ${className}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        key={url + i}
                        src={url}
                        alt=""
                        className={`absolute inset-0 transition-opacity duration-[1000ms] ${
                            i === index ? "opacity-100" : "opacity-0"
                        } ${className}`}
                    />
                )
            )}
        </div>
    );
}