import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageSlotProps = {
  src?: string;
  alt: string;
  aspectRatio: string;
  sizes: string;
  className?: string;
  /** Classes na imagem em si; o container tem overflow-hidden e recortaria a escala. */
  imageClassName?: string;
  /** "institucional" dessatura; "social" preserva a cor da foto. */
  treatment?: "institucional" | "social";
  priority?: boolean;
};

export function ImageSlot({
  src,
  alt,
  aspectRatio,
  sizes,
  className,
  imageClassName,
  treatment = "institucional",
  priority = false,
}: ImageSlotProps) {
  return (
    <div
      className={cn("relative z-0 overflow-hidden bg-bg-alt", className)}
      style={{ aspectRatio }}
    >
      {src ? (
        <>
          {/* O tratamento de foto só se aplica à foto: no slot vazio ele
              apagaria a textura, deixando um bloco preto chapado. */}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover",
              treatment === "social" ? "vl-photo-social" : "vl-photo",
              imageClassName,
            )}
          />
          {treatment === "institucional" ? (
            <div
              className="pointer-events-none absolute inset-0 bg-accent opacity-15 mix-blend-soft-light"
              aria-hidden
            />
          ) : null}
        </>
      ) : (
        <div className="absolute inset-0 vl-texture-slot bg-bg-alt" role="presentation" />
      )}
    </div>
  );
}
