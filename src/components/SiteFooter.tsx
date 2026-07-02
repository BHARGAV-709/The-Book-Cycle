import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="font-serif text-2xl font-semibold">The Book Cycle</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Giving beloved books their next chapter. Curated pre-loved reads, delivered with care.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/books" className="hover:text-foreground">All Books</Link></li>
            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/books" search={{ category: "programming" }} className="hover:text-foreground">Tech & Programming</Link></li>
            <li><Link to="/books" search={{ category: "telugu" }} className="hover:text-foreground">Telugu Literature</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Shipping</a></li>
            <li><a href="#" className="hover:text-foreground">Returns</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Stay in the loop</h4>
          <p className="text-sm text-muted-foreground">New arrivals and reader picks in your inbox.</p>
          <form className="mt-3 flex gap-2">
            <input type="email" placeholder="you@example.com" className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary" />
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} The Book Cycle. Every book has a story.
      </div>
    </footer>
  );
}
