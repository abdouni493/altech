import { OrbitGallery } from "@/components/ui/3d-orbit-gallery";
import { ThreeErrorBoundary } from "@/components/three/ErrorBoundary";

/** Programming-themed imagery animated in 3D behind the whole public site. */
const PROGRAMMING_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=70", // code on screen
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=70", // js code
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=70", // laptop code
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=70", // monitor code
  "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=70", // dev workspace
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=70", // dashboard
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=70", // terminal
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=70", // react / web
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=70", // colourful code
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=70", // matrix code
];

/**
 * Site-wide animated background: an animated mesh gradient layered with a
 * slow-orbiting 3D gallery of programming imagery. Fixed, non-interactive and
 * behind all content so pages stay readable.
 */
export function SiteBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none"
      aria-hidden
    >
      {/* animated gradient mesh */}
      <div className="absolute inset-0 mesh-bg" />

      {/* 3D animated programming pictures */}
      <div className="absolute inset-0 opacity-[0.22]">
        <ThreeErrorBoundary fallback={null}>
          <OrbitGallery
            images={PROGRAMMING_IMAGES}
            interactive={false}
            className="h-full w-full"
          />
        </ThreeErrorBoundary>
      </div>

      {/* readability veil + vignette */}
      <div className="absolute inset-0 bg-moo-bg/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0A0F_92%)]" />
    </div>
  );
}
