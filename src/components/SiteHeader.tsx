import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, Search, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/books", label: "Browse Books" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About Us" },
] as const;

export function SiteHeader() {
  const { user, logout } = useAuth();
  
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
          {user && (
            <>
              <Link
                to="/add-book"
                className="text-sm text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium underline underline-offset-8 decoration-primary decoration-2" }}
              >
                List a Book
              </Link>
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground transition hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium underline underline-offset-8 decoration-primary decoration-2" }}
              >
                Dashboard
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-1">
          <button aria-label="Search" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline-block px-2">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={logout}
                aria-label="Sign out" 
                className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-destructive"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to="/login" aria-label="Sign in" className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground" title="Sign in">
              <LogIn className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
