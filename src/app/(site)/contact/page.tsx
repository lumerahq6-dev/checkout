"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sent");
  }

  return (
    <div className="relative isolate overflow-hidden bg-bg-primary px-6 py-20 md:py-28 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-accent/[0.1] blur-[100px]" />
        <div className="absolute bottom-0 right-[-10%] h-[320px] w-[320px] rounded-full bg-accent/[0.06] blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(139,92,246,0.12),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-accent animate-fade-in-up stagger-1 [animation-fill-mode:both]">
          Kaimatsu
        </p>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-text-primary sm:text-5xl md:text-6xl animate-fade-in-up stagger-2 [animation-fill-mode:both]">
          CONTACT
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg animate-fade-in-up stagger-3 [animation-fill-mode:both]">
          Have questions or need assistance? Get in touch with me directly.
          Reach out via my contact form, I am here to make your experience easy
          and helpful.
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-14 w-full max-w-[600px] animate-fade-in-up stagger-3 [animation-fill-mode:both] md:mt-16">
        <div className="rounded-2xl border border-border-primary bg-bg-card/80 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-sm md:p-10">
          {status === "sent" ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="font-display text-lg font-semibold text-text-primary">
                Message received
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Thanks for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-text-primary"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-text-primary"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-medium text-text-primary"
                >
                  Phone number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-comment"
                  className="block text-sm font-medium text-text-primary"
                >
                  Comment
                </label>
                <textarea
                  id="contact-comment"
                  name="comment"
                  required
                  rows={6}
                  className="w-full resize-y rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25 min-h-[160px]"
                  placeholder="How can I help?"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(139,92,246,0.2)] transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Send
              </button>
            </form>
          )}
        </div>

        <div className="relative z-10 mx-auto mt-10 w-full max-w-[600px] animate-fade-in-up stagger-4 [animation-fill-mode:both]">
          <div className="rounded-xl border border-border-primary bg-bg-card/60 p-6 text-center backdrop-blur-sm">
            <p className="text-sm font-medium text-text-primary">
              You can also reach us directly
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-6">
              <a
                href="mailto:lumerahq6@gmail.com"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                lumerahq6@gmail.com
              </a>
              <a
                href="https://t.me/bossboy21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                @bossboy21 on Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
