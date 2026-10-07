import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { BookCard } from "@/components/BookCard";
import { categories } from "@/lib/books";
import { storage, StoredBook } from "@/lib/storage";

const searchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/books")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse Books — The Book Cycle" },
      { name: "description", content: "Browse our full collection of pre-loved books." },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const searchParams = Route.useSearch();
  const [books, setBooks] = useState<StoredBook[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(searchParams.category || "");
  const [condition, setCondition] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [exchangeOnly, setExchangeOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    storage.init();
    setBooks(storage.books.get());
  }, []);

  // Sync URL search params to state
  useEffect(() => {
    if (searchParams.category) {
      setCategory(searchParams.category);
    }
  }, [searchParams.category]);

  const filtered = useMemo(() => {
    let result = [...books];

    if (query) {
      const lowerQ = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(lowerQ) ||
          b.author.toLowerCase().includes(lowerQ) ||
          (b.isbn && b.isbn.toLowerCase().includes(lowerQ))
      );
    }

    if (category) {
      result = result.filter((b) => b.category === category);
    }
    if (condition) {
      result = result.filter((b) => b.condition === condition);
    }
    if (status) {
      result = result.filter((b) => b.status === status);
    }
    if (exchangeOnly) {
      result = result.filter((b) => b.exchangeAvailable);
    }

    result.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      // Default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [books, query, category, condition, status, exchangeOnly, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl">Browse Books</h1>
        <p className="mt-2 text-muted-foreground">
          Showing {filtered.length} book{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-1 lg:col-span-1 space-y-6">
          {/* Search */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Title, author, ISBN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Filters */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Any Condition</option>
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Acceptable">Acceptable</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Any Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="PENDING">Pending</option>
              <option value="EXCHANGED">Exchanged</option>
              <option value="SOLD">Sold</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="newest">Newest Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="exchangeOnly"
              checked={exchangeOnly}
              onChange={(e) => setExchangeOnly(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="exchangeOnly" className="text-sm font-medium leading-none">
              Exchange Available Only
            </label>
          </div>

          <button
            onClick={() => {
              setQuery("");
              setCategory("");
              setCondition("");
              setStatus("");
              setExchangeOnly(false);
              setSort("newest");
            }}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Clear Filters
          </button>
        </div>

        <div className="md:col-span-3 lg:col-span-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No books found</p>
              <p className="text-sm text-muted-foreground">
                Try changing your search or filters to find what you're looking for.
              </p>
            </div>
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
      </div>
    </div>
  );
}
