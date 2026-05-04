import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Pomodoro Focus",
    short_name: "Pomodoro",
    description: "Pomodoro timer with tasks, history, and offline support.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ba4949",
    theme_color: "#ba4949",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
