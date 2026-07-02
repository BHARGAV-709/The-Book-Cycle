import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getBook } from "@/lib/books";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book/$id")({
  loader: ({ params }) => {
    const book = getBook(params.id);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.book.title} — The Book Cycle` },
          { name: "description", content: `${loaderData.book.title} by ${loaderData.book.author}. Pre-loved, condition: ${loaderData.book.condition}.` },
          { property: "og:title", content: `${loaderData.book.title} — The Book Cycle` },
          { property: "og:image", content: loaderData.book.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-24 text-center">
      <h1 className="font-serif text-4xl">Book not found</h1>
      <Link to="/books" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Browse books</Link>
    </div>
  ),
  component: BookPage,
});

function BookPage() {
  const { book } = Route.useLoaderData();
  const { add } = useCart();
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/books" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to books
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <img src={book.image} alt={book.title} className="aspect-[4/5] w-full object-cover" />
        </div>
        <div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{book.condition}</span>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{book.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">by {book.author}</p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">₹{book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{book.originalPrice.toFixed(2)}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{discount}% off</span>
              </>
            )}
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 text-sm">
            <div><dt className="text-muted-foreground">Year</dt><dd className="font-medium">{book.year}</dd></div>
            <div><dt className="text-muted-foreground">Condition</dt><dd className="font-medium">{book.condition}</dd></div>
            <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium capitalize">{book.category.replace("-", " ")}</dd></div>
            {book.language && <div><dt className="text-muted-foreground">Language</dt><dd className="font-medium">{book.language}</dd></div>}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            A carefully inspected pre-loved copy. Ships within 24 hours, packaged with care so it arrives on your shelf ready for its next chapter.
          </p>
          <Button size="lg" className="mt-8 rounded-full" onClick={() => add(book)}>
            <ShoppingCart className="h-4 w-4" /> Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
