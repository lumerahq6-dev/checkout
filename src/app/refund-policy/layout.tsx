import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy – Kaimatsu",
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
