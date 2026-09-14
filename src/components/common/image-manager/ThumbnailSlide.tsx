import { useState, useEffect } from "react";
import { isVideoUrl, optimizeImage } from "../../../utils/imageUtils.ts";

interface Props {
    urls: string[];
    className?: string;
    intervalMs?: number;
    transitionMs?: number;
    optimizeWidth?: number;
    blurAmount?: number; // 흐려지는 정도 (px)
}

export default function ThumbnailSlide({
                                           urls,
                                           className = "",
                                           intervalMs = 3000,
                                           transitionMs = 1800,
                                           optimizeWidth,
                                           blurAmount = 10,
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
                const src = !isVideo && optimizeWidth ? optimizeImage(url, optimizeWidth) : url;
                const active = i === index;

                const style: React.CSSProperties = {
                    transitionProperty: "opacity, filter",
                    transitionDuration: `${transitionMs}ms`,
                    transitionTimingFunction: "ease-in-out",
                    opacity: active ? 1 : 0,
                    filter: active ? "blur(0px)" : `blur(${blurAmount}px)`,
                };

                return isVideo ? (
                    <video
                        key={url + i}
                        src={src}
                        className={`absolute inset-0 ${className}`}
                        style={style}
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
                        className={`absolute inset-0 ${className}`}
                        style={style}
                    />
                );
            })}
        </div>
    );
}