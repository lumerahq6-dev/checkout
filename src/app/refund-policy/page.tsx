"use client";

import { FormEvent, useState } from "react";

const SUPPORT_EMAIL = "lumerahq6@gmail.com";

const ISSUE_TYPES = [
  "Subscription Cancellation",
  "Billing Error",
  "Technical Issue",
  "Unauthorized Charge",
  "Other",
] as const;

export default function RefundPolicyPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const orderId = String(data.get("orderId") ?? "").trim();
    const issueType = String(data.get("issueType") ?? "");
    const description = String(data.get("description") ?? "").trim();

    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Order/Transaction ID: ${orderId || "(not provided)"}`,
      `Issue Type: ${issueType}`,
      "",
      "Description:",
      description,
    ];
    const body = bodyLines.join("\n");

    const subject = `Kaimatsu Support — ${issueType}`;
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
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

      <div className="relative z-10 mx-auto max-w-[800px]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-accent animate-fade-in-up stagger-1 [animation-fill-mode:both]">
          Kaimatsu
        </p>
        <p className="mb-6 text-sm text-text-muted animate-fade-in-up stagger-1 [animation-fill-mode:both]">
          Last updated: March 25, 2026
        </p>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-text-primary sm:text-4xl md:text-5xl animate-fade-in-up stagger-2 [animation-fill-mode:both]">
          Refund Policy
        </h1>
        <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg animate-fade-in-up stagger-3 [animation-fill-mode:both]">
          Kaimatsu sells digital video editing plugins, asset packs, and Discord
          coaching subscriptions. Payments are processed by Paddle (Merchant of
          Record). This policy explains how refunds, cancellations, and billing
          support work.
        </p>

        <div className="mt-12 space-y-10 border-t border-border-primary pt-12 animate-fade-in-up stagger-4 [animation-fill-mode:both]">
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              1. Overview
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              Due to the digital nature of our products (plugins, asset packs,
              presets), all sales are final and non-refundable once the product
              has been delivered or access has been granted.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              2. Subscription Cancellations
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              You may cancel your subscription at any time through your account
              settings or by contacting support. Upon cancellation, you will
              retain access until the end of your current billing period. No
              partial refunds are issued for unused portions of a billing cycle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              3. Exceptions
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              We take the following situations seriously:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-secondary md:text-base">
              <li>
                <span className="text-text-primary">Technical issues</span> that
                prevent the product from functioning as described — we will work
                with you to resolve the issue. If we cannot resolve it, we may
                issue a credit or replacement at our discretion.
              </li>
              <li>
                <span className="text-text-primary">
                  Duplicate charges or billing errors
                </span>{" "}
                — contact us and we will investigate and correct any verified
                billing mistakes.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              4. Unauthorized or Fraudulent Charges
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              If you believe there has been unauthorized or fraudulent activity
              on your account, we recommend contacting your bank or card issuer
              directly to dispute the charge. They have established processes to
              investigate and resolve unauthorized transactions. Kaimatsu will
              cooperate fully with any investigation and will immediately cancel
              the associated subscription to prevent further charges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              5. EU/EEA/UK Consumer Rights
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              If you are located in the EU, EEA, or United Kingdom, you may have
              a statutory 14-day withdrawal right for digital content
              purchases. However, by beginning the download or accessing digital
              content, you acknowledge and consent to the loss of your withdrawal
              right, as permitted under applicable consumer protection laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-text-primary">
              6. How to Contact Us
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              For billing questions, cancellation help, or to report an issue, use
              the form below or reach out directly:
            </p>
            <ul className="list-none space-y-2 text-sm leading-relaxed text-text-secondary md:text-base">
              <li>
                <span className="text-text-muted">Email:</span>{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-accent underline-offset-2 transition-colors hover:text-accent-hover hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <span className="text-text-muted">Telegram:</span>{" "}
                <a
                  href="https://t.me/bossboy21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent underline-offset-2 transition-colors hover:text-accent-hover hover:underline"
                >
                  @bossboy21
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-20 w-full max-w-[600px] border-t border-border-primary pt-16">
        <div className="text-center animate-fade-in-up stagger-1 [animation-fill-mode:both]">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-text-primary sm:text-3xl">
            Need Help? Submit a Request
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-text-secondary md:text-base">
            For billing issues, cancellations, or account concerns — fill out the
            form below and we&apos;ll get back to you within 24-48 hours.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border-primary bg-bg-card/80 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-sm md:p-10 animate-fade-in-up stagger-2 [animation-fill-mode:both]">
          {status === "sent" ? (
            <div className="py-8 text-center">
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
                Request prepared
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Your default email app should open with a draft to{" "}
                {SUPPORT_EMAIL}. Send the message to complete your request. If
                nothing opened, email us directly or use Telegram below.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <label
                  htmlFor="refund-name"
                  className="block text-sm font-medium text-text-primary"
                >
                  Name
                </label>
                <input
                  id="refund-name"
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
                  htmlFor="refund-email"
                  className="block text-sm font-medium text-text-primary"
                >
                  Email
                </label>
                <input
                  id="refund-email"
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
                  htmlFor="refund-order"
                  className="block text-sm font-medium text-text-primary"
                >
                  Order/Transaction ID{" "}
                  <span className="font-normal text-text-muted">(optional)</span>
                </label>
                <input
                  id="refund-order"
                  name="orderId"
                  type="text"
                  autoComplete="off"
                  className="w-full rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="Paddle receipt or transaction ID"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="refund-issue"
                  className="block text-sm font-medium text-text-primary"
                >
                  Issue Type
                </label>
                <select
                  id="refund-issue"
                  name="issueType"
                  required
                  className="w-full cursor-pointer rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-bg-secondary">
                    Select an issue type
                  </option>
                  {ISSUE_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-bg-secondary">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="refund-description"
                  className="block text-sm font-medium text-text-primary"
                >
                  Description
                </label>
                <textarea
                  id="refund-description"
                  name="description"
                  required
                  rows={6}
                  className="min-h-[160px] w-full resize-y rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-muted outline-none transition-[border-color,box-shadow] focus:border-border-accent focus:ring-2 focus:ring-accent/25"
                  placeholder="Describe your issue in detail"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(139,92,246,0.2)] transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Submit Request
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-border-accent/40 bg-bg-secondary/60 p-6 text-center shadow-[0_0_0_1px_rgba(139,92,246,0.08)_inset] animate-fade-in-up stagger-3 [animation-fill-mode:both]">
          <p className="text-sm leading-relaxed text-text-secondary">
            You can also reach us directly on Telegram at{" "}
            <a
              href="https://t.me/bossboy21"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent underline-offset-2 transition-colors hover:text-accent-hover hover:underline"
            >
              @bossboy21
            </a>{" "}
            for faster support.
          </p>
        </div>
      </div>
    </div>
  );
}
