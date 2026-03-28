import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-text-muted">
          Loading checkout…
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
