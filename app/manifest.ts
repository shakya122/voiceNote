import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "VoiceNotes", short_name: "VoiceNotes", start_url: "/", display: "standalone", background_color: "#F7F5F0", theme_color: "#003366" };
}
