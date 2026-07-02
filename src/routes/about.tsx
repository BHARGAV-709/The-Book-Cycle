import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — The Book Cycle" },
      { name: "description", content: "The Book Cycle gives beloved books a second chapter — a curated community of readers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-serif text-5xl">About The Book Cycle</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        The Book Cycle began with a simple idea: great books deserve more than one reader.
        We rescue, inspect, and re-shelve pre-loved titles so they can find their next home
        — and their next story.
      </p>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/90">
        <p>
          Every book on our shelves is hand-picked and graded for condition, from Like New to Acceptable.
          You'll always know what you're getting, and how many hands have already turned its pages.
        </p>
        <p>
          Our collection spans timeless classics, contemporary fiction, technical manuals for builders,
          and a growing Telugu literature section close to our roots.
        </p>
        <p>
          Whether you're rebuilding a childhood library or hunting for a first edition, we hope you find
          something here that belongs on your nightstand.
        </p>
      </div>
    </div>
  );
}
