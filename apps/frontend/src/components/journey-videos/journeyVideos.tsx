"use client";

import  { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const videos = [
  { videoUrl: "https://www.youtube.com/watch?v=k1nRcy9rZIc" },
  { videoUrl: "https://www.youtube.com/watch?v=S-L4y9eyjso" },
  { videoUrl: "https://www.youtube.com/watch?v=k1nRcy9rZIc" },
  { videoUrl: "https://www.youtube.com/watch?v=S-L4y9eyjso" },
];

const getYouTubeId = (url:any) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    return "";
  } catch {
    return "";
  }
};

const getYouTubeThumb = (url:any) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/0.jpg` : "";
};

const AUTOPLAY_DELAY = 4000;

const JourneyVideos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false })]
  );

  const slides = videos.map((v) => ({
    ...v,
    thumbnail: getYouTubeThumb(v.videoUrl),
  }));

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleClick = (index: number, videoUrl: string) => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() === index) {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    } else {
      emblaApi.scrollTo(index);
    }
  };

  return (
    <section className="w-full py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 px-2 sm:px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          From dreams to deals:
          <br />
          our journey!
        </h2>

        <div className="relative w-full">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 pb-8 sm:pb-10 md:pb-12">
              {slides.map((video, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[90%] xs:w-[85%] sm:w-[70%] md:w-[55%] lg:w-[calc(40%-12px)] xl:w-[calc(33.333%-16px)]"
                  >
                    <div
                      onClick={() => handleClick(i, video.videoUrl)}
                      className={`relative cursor-pointer transition-all duration-500 ease-out ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-70 sm:scale-90 md:scale-85 lg:scale-90"
                      }`}
                    >
                      <div className="relative aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-md sm:shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img
                          src={video.thumbnail}
                          alt={`Journey Video ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading={i === 0 ? "eager" : "lazy"}
                          fetchPriority={i === 0 ? "high" : "auto"}
                          decoding="async"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                            <svg
                              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-gray-900 ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <polygon points="8,5 19,12 8,19" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
            {slides.map((_, j) => (
              <div
                key={j}
                className="w-12 sm:w-14 md:w-16 lg:w-18 xl:w-20 h-1 bg-gray-200 overflow-hidden rounded-full"
              >
                <div
                  className={`h-full bg-gray-900 ${
                    j === activeIndex
                      ? "w-full transition-[width] duration-[4000ms] ease-linear"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyVideos;
