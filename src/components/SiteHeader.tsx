import { Link } from "@tanstack/react-router";
import { LogIn, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Browse Books" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About Us" },
] as const;

export function SiteHeader() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
          The Book Cycle
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium underline underline-offset-8 decoration-primary decoration-2" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button aria-label="Search" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Sign in" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <LogIn className="h-5 w-5" />
          </button>
          <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
