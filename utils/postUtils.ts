import { PostMedium } from "../lib/generated/prisma/enums";

export const mediumLabels: Record<PostMedium, string> = {
  DIGITAL: "Digital",
  OIL_PAINT: "Oil Paint",
  WATERCOLOR: "Watercolor",
  PHOTOGRAPHY: "Photography",
  ACRYLIC: "Acrylic",
  SCULPTURE: "Sculpture",
  MIXED_MEDIA: "Mixed Media",
  SKETCH: "Sketch",
  THREE_D: "3D",
  ANIMATION: "Animation",
  TWO_D: "2D",
  VFX: "VFX",
  INK: "Ink",
  CRAYON: "Crayon",
  PASTELS: "Pastels",
  ALCOHOL_MARKERS: "Alcohol Markers",
  COLORED_PENCIL: "Colored Pencils",
  TRADITIONAL_ART: "Traditional Art",
  OTHER: "Other",
};

export function postTime(date: string | number | Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
