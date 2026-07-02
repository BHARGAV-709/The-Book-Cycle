import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart — The Book Cycle" }, { name: "robots", content: "noindex" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, total, clear } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl">Your Cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/books" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Browse books</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map(({ book, qty }) => (
            <div key={book.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <img src={book.image} alt="" className="h-20 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="font-serif text-lg">{book.title}</div>
                <div className="text-sm text-muted-foreground">{book.author}</div>
                <div className="text-sm">Qty: {qty}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{(book.price * qty).toFixed(2)}</div>
                <button onClick={() => remove(book.id)} className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <button onClick={clear} className="text-sm text-muted-foreground hover:text-foreground">Clear cart</button>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-serif text-3xl">₹{total.toFixed(2)}</div>
            </div>
          </div>
          <Button size="lg" className="w-full rounded-full">Checkout</Button>
        </div>
      )}
    </div>
  );
}
