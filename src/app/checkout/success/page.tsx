"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const txn = params.get("txn");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!txn) {
      setStatus("error");
      return;
    }
    // Transaction completed — webhook handles fulfillment server-side
    setStatus("success");
  }, [txn]);

  return (
    <div className="relative isolate min-h-[80vh] flex items-center justify-center bg-bg-primary px-6">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 left-1/2 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-success/[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        {status === "loading" && (
          <div className="animate-fade-in-up [animation-fill-mode:both]">
            <div className="mx-auto mb-6 h-12 w-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            <p className="text-text-secondary">Verifying your payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-fade-in-up [animation-fill-mode:both]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
              <svg
                className="h-10 w-10 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Payment Successful!
            </h1>
            <p className="mt-4 text-text-secondary">
              Thank you for your purchase. Your order is being processed.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              You will receive a confirmation email shortly.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="animate-fade-in-up [animation-fill-mode:both]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sale/15">
              <svg
                className="h-10 w-10 text-sale"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mt-4 text-text-secondary">
              We couldn&apos;t verify your payment. Please contact support if
              you believe this is an error.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-bg-primary">
          <div className="h-12 w-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
