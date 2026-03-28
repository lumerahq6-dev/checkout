import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Kaimatsu",
  description: "Complete your purchase securely with Paddle.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
