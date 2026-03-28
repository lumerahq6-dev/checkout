import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Kaimatsu",
  description: "Review items in your cart.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
