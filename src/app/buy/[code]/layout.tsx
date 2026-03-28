import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy | Kaimatsu",
  description: "Redirects to secure checkout on this site.",
};

export default function BuyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
