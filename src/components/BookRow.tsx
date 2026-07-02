import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "./BookCard";
import type { Book } from "@/lib/books";

export function BookRow({
  title,
  subtitle,
  books,
}: {
  title: string;
  subtitle?: string;
  books: Book[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="rounded-full border border-border bg-card p-2 text-foreground transition hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={ref} className="scroll-row -mx-4 px-4">
        {books.map((b) => (
          <div key={b.id} className="scroll-row-item">
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </section>
  );
}
