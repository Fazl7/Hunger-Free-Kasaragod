import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hunger Free Kasaragod",
    short_name: "Hunger Free",
    description: "Free meals, grocery kits and surplus food rescue across Kasaragod, by Live to Smile Foundation.",
    start_url: "/en",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#7A1F1F",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
