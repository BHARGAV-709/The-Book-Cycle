import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { BookCard } from "@/components/BookCard";
import { books, categories } from "@/lib/books";

const search = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/books")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Browse Books — The Book Cycle" },
      { name: "description", content: "Browse our full collection of pre-loved books by category." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const { category, q } = Route.useSearch();
  const filtered = books.filter((b) => {
    if (category && b.category !== category) return false;
    if (q && !`${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const activeLabel = categories.find((c) => c.slug === category)?.label;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl">Browse Books</h1>
        <p className="mt-2 text-muted-foreground">
          {activeLabel ? `Showing "${activeLabel}" — ` : ""}{filtered.length} book{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pb-8">
        <Link
          to="/books"
          className={`rounded-full border border-border px-4 py-1.5 text-sm ${!category ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-primary"}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            to="/books"
            search={{ category: c.slug }}
            className={`rounded-full border border-border px-4 py-1.5 text-sm ${category === c.slug ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:border-primary"}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No books match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {filtered.map((b) => (
            <div key={b.id} className="[&>div]:w-full">
              <BookCard book={b} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
