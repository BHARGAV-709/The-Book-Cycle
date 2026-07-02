import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Truck } from "lucide-react";
import { BookRow } from "@/components/BookRow";
import { booksByIds, categories, featuredIds, techIds, teluguIds, classicsIds } from "@/lib/books";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Your Next Reading Adventure Awaits
          </span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            Discover Preloved Books<br />at The Book Cycle
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Find your next literary treasure from our curated collection of second-hand books.
            Every book has a story, even before you open it.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Browse Collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      <BookRow
        title="Featured Books"
        subtitle="Our curated selection of the finest pre-loved books this week."
        books={booksByIds(featuredIds)}
      />

      <BookRow
        title="Tech & Programming"
        subtitle="Expand your knowledge with our collection of programming and technology books."
        books={booksByIds(techIds)}
      />

      {/* Why choose */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl">Why Choose The Book Cycle?</h2>
            <p className="mt-3 text-muted-foreground">
              We're more than just a second-hand bookstore. We're a community of book lovers.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "Quality Guarantee", body: "All our books are carefully inspected and categorized by condition, so you know exactly what you're getting." },
              { icon: Sparkles, title: "Personal Touch", body: "Each book comes with a note from its previous owner, sharing why this book was special to them." },
              { icon: Truck, title: "Fast Delivery", body: "We ship all orders within 24 hours, carefully packaged so your books arrive in perfect condition." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookRow
        title="Telugu Literature"
        subtitle="Explore our collection of classic and contemporary Telugu books."
        books={booksByIds(teluguIds)}
      />

      <BookRow
        title="Timeless Classics"
        subtitle="Discover literary masterpieces that have stood the test of time."
        books={booksByIds(classicsIds)}
      />

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl">Browse by Category</h2>
          <p className="mt-3 text-muted-foreground">
            Explore our extensive collection of pre-loved books across various genres.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/books"
              search={{ category: c.slug }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
            >
              {c.label}
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground shadow-lg">
          <h2 className="font-serif text-4xl sm:text-5xl">Ready to Find Your Next Literary Adventure?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/90">
            Join thousands of readers who have found their favorite books at The Book Cycle. We add new titles every day.
          </p>
          <Link
            to="/books"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-95"
          >
            Start Browsing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
