"use client";

import Link from "next/link";

const paymentMethods = [
  "American Express",
  "Apple Pay",
  "Bancontact",
  "Diners Club",
  "Discover",
  "Google Pay",
  "Klarna",
  "Maestro",
  "Mastercard",
  "Shop Pay",
  "Union Pay",
  "Visa",
];

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
  { href: "https://discord.gg/p3KEQVKNHW", label: "Discord", external: true },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-primary bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Kaimatsu
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Professional video editing plugins, asset packs, and private
              Discord coaching. Level up your edits.
            </p>
            <Link
              href="https://www.youtube.com/@kaimatsu."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-text-secondary hover:text-accent transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
              </svg>
              kaimatsu.
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary mb-3 mt-6">
              Legal
            </h3>
            <nav className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-text-primary mb-4">
              Subscribe to our newsletter
            </h3>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2.5 bg-bg-primary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                &rarr;
              </button>
            </form>
          </div>
        </div>

        <div className="py-6 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()}, Kaimatsu. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="text-[10px] text-text-muted bg-bg-tertiary px-2 py-1 rounded"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
