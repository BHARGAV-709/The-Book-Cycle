import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { StoredBook } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export function BookCard({ book }: { book: StoredBook }) {
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex w-64 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        to="/book/$id"
        params={{ id: book.id }}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <img
          src={book.image}
          alt={book.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
          {book.condition}
        </span>
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
            {discount}% OFF
          </span>
        )}
        {book.status && book.status !== "AVAILABLE" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground shadow">
            {book.status}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          to="/book/$id"
          params={{ id: book.id }}
          className="line-clamp-1 font-serif text-lg font-semibold leading-tight hover:text-primary"
        >
          {book.title}
        </Link>
        <p className="line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-foreground">₹{book.price.toFixed(2)}</span>
          {book.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{book.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {book.category} • {book.condition}
        </p>
        <Button
          size="sm"
          className="mt-2 rounded-full"
          asChild
        >
          <Link to="/book/$id" params={{ id: book.id }}>
            View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
