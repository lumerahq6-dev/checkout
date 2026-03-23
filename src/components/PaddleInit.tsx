"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: Record<string, unknown>) => void;
      Environment: { set: (env: string) => void };
      Checkout: { open: (config: Record<string, unknown>) => void };
    };
  }
}

export default function PaddleInit() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.Paddle) {
        clearInterval(interval);
        const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
        if (env === "sandbox") {
          window.Paddle.Environment.set("sandbox");
        }
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
          eventCallback: function (event: { name: string; data?: { transaction_id?: string } }) {
            if (event.name === "checkout.completed" && event.data?.transaction_id) {
              window.location.href = `/checkout/success?txn=${event.data.transaction_id}`;
            }
          },
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return null;
}
