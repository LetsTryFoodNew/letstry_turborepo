"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { carouselImagesDesktop,  carouselImagesPhone} from "@/config/carousel-config";
import Autoplay from "embla-carousel-autoplay";

export const HeroCarousel = () => {
  return (
    <section className="mx-auto px-2 py-2 sm:py-4 sm:px-6 lg:px-8  md:py-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full block sm:hidden"
      >
        <CarouselContent>
          {carouselImagesPhone.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative w-full h-auto aspect-[16/9] overflow-hidden rounded-[10px] bg-gray-100">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={image.id === 1}
                  loading={image.id === 1 ? "eager" : "lazy"}
                  fetchPriority={image.id === 1 ? "high" : "auto"}
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full hidden sm:block"
      >
        <CarouselContent>
          {carouselImagesDesktop.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative w-full h-auto sm:h-[400px] lg:h-[500px] sm:aspect-[18/9] md:aspect-[21/9] overflow-hidden rounded-[10px] bg-gray-100">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={image.id === 1}
                  loading={image.id === 1 ? "eager" : "lazy"}
                  fetchPriority={image.id === 1 ? "high" : "auto"}
                  unoptimized
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex left-4" />
        <CarouselNext className="hidden sm:flex right-4" />
      </Carousel>
    </section>
  );
};
