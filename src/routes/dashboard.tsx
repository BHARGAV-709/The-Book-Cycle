import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, BookOpen, Clock, CheckCircle, Heart, ArrowRight, Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { storage, StoredBook, BookRequest, Favorite, acceptRequest, rejectRequest, completeExchange } from "@/lib/storage";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — The Book Cycle" },
      { name: "description", content: "Manage your books and requests." },
    ]
  })
});

function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [books, setBooks] = useState<StoredBook[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const refreshData = () => {
    storage.init();
    setBooks(storage.books.get());
    setRequests(storage.requests.get());
    setFavorites(storage.favorites.get());
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.navigate({ to: "/login" });
      return;
    }
    if (user) refreshData();
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="p-24 text-center">Loading dashboard...</div>;
  }

  // Actions
  const handleAccept = (reqId: string) => {
    if (acceptRequest(reqId, user.id)) refreshData();
  };
  
  const handleReject = (reqId: string) => {
    if (rejectRequest(reqId, user.id)) refreshData();
  };

  const handleComplete = (reqId: string) => {
    if (completeExchange(reqId, user.id)) refreshData();
  };

  // Derived statistics
  const myBooks = books.filter(b => b.ownerId === user.id);
  const activeListings = myBooks.filter(b => b.status === "AVAILABLE").length;
  
  const incomingRequests = requests.filter(r => r.ownerId === user.id);
  const outgoingRequests = requests.filter(r => r.requesterId === user.id);
  
  const pendingIncoming = incomingRequests.filter(r => r.status === "PENDING").length;
  const pendingOutgoing = outgoingRequests.filter(r => r.status === "PENDING").length;
  const pendingRequests = pendingIncoming + pendingOutgoing;

  const completedExchanges = incomingRequests.filter(r => r.status === "COMPLETED" || r.status === "EXCHANGED").length + 
                             outgoingRequests.filter(r => r.status === "COMPLETED" || r.status === "EXCHANGED").length;

  const myFavorites = favorites.filter(f => f.userId === user.id);

  const getBookById = (id: string) => books.find(b => b.id === id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-muted-foreground">Manage your books, requests, and exchanges from one place.</p>
        </div>
        <Link 
          to="/add-book" 
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> List a Book
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">My Books</span>
          </div>
          <p className="text-3xl font-semibold">{myBooks.length}</p>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Active</span>
          </div>
          <p className="text-3xl font-semibold">{activeListings}</p>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <p className="text-3xl font-semibold">{pendingRequests}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Exchanged</span>
          </div>
          <p className="text-3xl font-semibold">{completedExchanges}</p>
        </div>

        <div className="col-span-2 md:col-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Favorites</span>
          </div>
          <p className="text-3xl font-semibold">{myFavorites.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left Column: My Books */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold font-serif">My Books</h2>
            </div>
            
            {myBooks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">You haven't listed any books yet.</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-6">List your first book to share it with the community.</p>
                <Link to="/add-book" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                  List Your First Book
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {myBooks.map(book => (
                  <div key={book.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition">
                    <img src={book.image} alt={book.title} className="h-24 w-16 rounded object-cover bg-muted shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate" title={book.title}>{book.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          book.status === "AVAILABLE" ? "bg-green-100 text-green-800" :
                          book.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {book.status}
                        </span>
                        <Link to="/book/$id" params={{ id: book.id }} className="text-xs font-medium text-primary hover:underline">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Requests Section */}
          <section>
            <h2 className="text-2xl font-semibold font-serif mb-6">Recent Requests</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Incoming Requests</h3>
                {incomingRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border border-border">No incoming requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {incomingRequests.slice().reverse().map(req => {
                      const book = getBookById(req.bookId);
                      return (
                        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card gap-4">
                          <div>
                            <p className="font-medium text-sm">{book?.title || "Unknown Book"}</p>
                            <p className="text-xs text-muted-foreground">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                              req.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                              req.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                              req.status === "REJECTED" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {req.status}
                            </span>
                            
                            {req.status === "PENDING" && (
                              <>
                                <button onClick={() => handleAccept(req.id)} className="h-7 w-7 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200" aria-label="Accept">
                                  <Check className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleReject(req.id)} className="h-7 w-7 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200" aria-label="Reject">
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            
                            {req.status === "ACCEPTED" && (
                              <button onClick={() => handleComplete(req.id)} className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/90">
                                Complete Exchange
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Outgoing Requests</h3>
                {outgoingRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border border-border">You haven't requested any books yet.</p>
                ) : (
                  <div className="space-y-3">
                    {outgoingRequests.slice().reverse().map(req => {
                      const book = getBookById(req.bookId);
                      return (
                        <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                          <div>
                            <p className="font-medium text-sm">{book?.title || "Unknown Book"}</p>
                            <p className="text-xs text-muted-foreground">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                            req.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            req.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                            req.status === "REJECTED" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Favorites & Activity */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold font-serif mb-6">Favorites</h2>
            {myFavorites.length === 0 ? (
              <p className="text-sm text-muted-foreground p-6 text-center rounded-xl border border-dashed border-border">
                Your favorite books will appear here.
              </p>
            ) : (
              <div className="space-y-4">
                {myFavorites.map(fav => {
                  const book = getBookById(fav.bookId);
                  if (!book) return null;
                  return (
                    <Link key={fav.bookId} to="/book/$id" params={{ id: book.id }} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition group">
                      <img src={book.image} alt={book.title} className="h-16 w-12 rounded object-cover bg-muted" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition">{book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
