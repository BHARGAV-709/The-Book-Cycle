import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { categories } from "@/lib/books";
import { storage, StoredBook } from "@/lib/storage";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — The Book Cycle" },
      { name: "description", content: "Browse pre-loved books by category and genre." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const [books, setBooks] = useState<StoredBook[]>([]);

  useEffect(() => {
    storage.init();
    setBooks(storage.books.get());
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl">Categories</h1>
      <p className="mt-2 text-muted-foreground">Pick a shelf and start browsing.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const preview = books.find(b => b.category === c.slug);
          return (
            <Link
              key={c.slug}
              to="/books"
              search={{ category: c.slug }}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-20 w-16 flex-none overflow-hidden rounded-lg bg-muted">
                {preview && <img src={preview.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <div className="font-serif text-xl group-hover:text-primary">{c.label}</div>
                <div className="text-sm text-muted-foreground">{c.count} books</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
