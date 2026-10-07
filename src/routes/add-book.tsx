import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { storage, StoredBook } from "@/lib/storage";
import { categories } from "@/lib/books";

export const Route = createFileRoute("/add-book")({
  component: AddBookPage,
  head: () => ({
    meta: [
      { title: "List a Book — The Book Cycle" },
      { name: "description", content: "List a book for exchange or sale." },
    ],
  }),
});

function AddBookPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [exchangeAvailable, setExchangeAvailable] = useState(true);
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.navigate({ to: "/login" });
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="p-24 text-center">Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !author.trim() || !category || !condition) {
      setError("Please fill in all required fields (Title, Author, Category, Condition).");
      return;
    }

    const parsedPrice = price ? parseFloat(price) : 0;
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a valid positive number.");
      return;
    }

    if (description.length > 2000) {
      setError("Description is too long (maximum 2000 characters).");
      return;
    }

    const newBook: StoredBook = {
      id: "book-" + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      author: author.trim(),
      category,
      condition,
      price: parsedPrice,
      exchangeAvailable,
      isbn: isbn.trim() || undefined,
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      image: image.trim() || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80", // fallback image
      ownerId: user.id,
      status: "AVAILABLE",
      createdAt: new Date().toISOString(),
      year: new Date().getFullYear(), // Provide a default year for legacy compatibility if needed
    };

    const currentBooks = storage.books.get();
    storage.books.set([...currentBooks, newBook]);

    // Redirect to the newly created book
    router.navigate({ to: "/book/$id", params: { id: newBook.id } });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl sm:text-5xl">List a Book</h1>
        <p className="mt-2 text-muted-foreground">Share your pre-loved books with the community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Book Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="The Great Gatsby"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Author *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="F. Scott Fitzgerald"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Select Condition</option>
                <option value="Like New">Like New</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Tell us about the book's condition, interesting notes, or why you loved it..."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="0.00 for free"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">ISBN</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Campus / City"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="exchangeAvailable"
              checked={exchangeAvailable}
              onChange={(e) => setExchangeAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="exchangeAvailable" className="text-sm font-medium leading-none">
              Open to Exchange
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            List Book
          </button>
        </div>
      </form>
    </div>
  );
}
