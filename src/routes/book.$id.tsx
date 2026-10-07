import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { storage, StoredBook, BookRequest } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book/$id")({
  component: BookPage,
});

function BookPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [book, setBook] = useState<StoredBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [existingRequest, setExistingRequest] = useState<BookRequest | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    storage.init();
    const books = storage.books.get();
    const foundBook = books.find((b) => b.id === id);
    setBook(foundBook || null);

    if (foundBook && user) {
      const requests = storage.requests.get();
      const userRequests = requests.filter(r => r.bookId === id && r.requesterId === user.id);
      const activeReq = userRequests.find(r => ["PENDING", "ACCEPTED", "COMPLETED"].includes(r.status));
      setExistingRequest(activeReq || null);

      const favorites = storage.favorites.get();
      setIsFavorite(favorites.some(f => f.bookId === id && f.userId === user.id));
    }
    setIsLoading(false);
  }, [id, user]);

  const handleRequest = () => {
    if (!user) {
      router.navigate({ to: "/login" });
      return;
    }
    if (!book || book.ownerId === user.id || book.status !== "AVAILABLE" || existingRequest) return;

    const newRequest: BookRequest = {
      id: "req-" + Math.random().toString(36).substring(2, 9),
      bookId: book.id,
      requesterId: user.id,
      ownerId: book.ownerId || "",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentRequests = storage.requests.get();
    storage.requests.set([...currentRequests, newRequest]);
    setExistingRequest(newRequest);
    
    // Also update book status to PENDING
    const books = storage.books.get();
    const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: "PENDING" as const } : b);
    storage.books.set(updatedBooks);
    setBook({ ...book, status: "PENDING" });
  };

  const toggleFavorite = () => {
    if (!user) {
      router.navigate({ to: "/login" });
      return;
    }
    const currentFavs = storage.favorites.get();
    if (isFavorite) {
      storage.favorites.set(currentFavs.filter(f => !(f.bookId === id && f.userId === user.id)));
      setIsFavorite(false);
    } else {
      storage.favorites.set([...currentFavs, { bookId: id, userId: user.id }]);
      setIsFavorite(true);
    }
  };

  if (isLoading) {
    return <div className="p-24 text-center">Loading...</div>;
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-serif text-4xl">Book not found</h1>
        <p className="mt-2 text-muted-foreground">This book may have been removed or is unavailable.</p>
        <Link to="/books" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Browse books</Link>
      </div>
    );
  }

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const isOwner = user && book.ownerId === user.id;

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
          <div className="flex gap-2 mb-4">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{book.condition}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              book.status === "AVAILABLE" ? "bg-green-100 text-green-800" :
              book.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {book.status}
            </span>
            {book.exchangeAvailable && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Exchange Available
              </span>
            )}
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl">{book.title}</h1>
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
            <div><dt className="text-muted-foreground">Category</dt><dd className="font-medium capitalize">{book.category.replace("-", " ")}</dd></div>
            <div><dt className="text-muted-foreground">Condition</dt><dd className="font-medium">{book.condition}</dd></div>
            <div><dt className="text-muted-foreground">Listed on</dt><dd className="font-medium">{new Date(book.createdAt).toLocaleDateString()}</dd></div>
            {book.location && <div><dt className="text-muted-foreground">Location</dt><dd className="font-medium">{book.location}</dd></div>}
          </dl>

          <div className="mt-6">
            <h3 className="font-medium text-foreground">Description</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {book.description || "No description provided for this book. A carefully inspected pre-loved copy ready for its next chapter."}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            {isOwner ? (
              <Button size="lg" className="rounded-full w-full" disabled>
                You own this listing
              </Button>
            ) : existingRequest?.status === "PENDING" ? (
              <Button size="lg" className="rounded-full w-full" disabled>
                Request Pending
              </Button>
            ) : existingRequest?.status === "ACCEPTED" ? (
              <Button size="lg" className="rounded-full w-full bg-green-600 hover:bg-green-700 text-white cursor-default">
                Request Accepted
              </Button>
            ) : existingRequest?.status === "COMPLETED" ? (
              <Button size="lg" className="rounded-full w-full bg-blue-600 hover:bg-blue-700 text-white cursor-default">
                Exchange Completed
              </Button>
            ) : book.status === "AVAILABLE" ? (
              <Button size="lg" className="rounded-full w-full" onClick={handleRequest}>
                <BookOpen className="h-4 w-4 mr-2" /> Request Book
              </Button>
            ) : (
              <Button size="lg" className="rounded-full w-full" disabled>
                Currently Unavailable
              </Button>
            )}
            
            <Button size="icon" variant="outline" className={`rounded-full shrink-0 ${isFavorite ? "text-red-500 border-red-200 bg-red-50" : ""}`} onClick={toggleFavorite}>
              <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            </Button>
          </div>
          
          {!user && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Please <Link to="/login" className="underline font-medium text-primary">log in</Link> to request this book.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
