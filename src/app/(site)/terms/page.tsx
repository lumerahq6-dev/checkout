import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions – Kaimatsu",
  description:
    "Terms and conditions for Kaimatsu subscriptions, digital products, and services.",
};

const sections: { title: string; children: React.ReactNode }[] = [
  {
    title: "Agreement to Terms",
    children: (
      <p>
        By accessing this website, creating an account, or purchasing a
        subscription or digital product from Kaimatsu, you agree to be bound by
        these Terms & Conditions. If you do not agree, you must not use our
        services or make a purchase.
      </p>
    ),
  },
  {
    title: "Description of Services",
    children: (
      <p>
        Kaimatsu provides digital products and services for video editors,
        including video editing plugins, asset packs (such as transitions, LUTs,
        sound effects, and overlays), and private coaching delivered through a
        Discord subscription as described at the time of purchase or on our
        site.
      </p>
    ),
  },
  {
    title: "Subscription Terms",
    children: (
      <>
        <p>
          Subscriptions are billed on a monthly basis and renew automatically
          until cancelled. When you cancel, your access continues through the end
          of the current billing period; you will not be charged for subsequent
          periods.
        </p>
        <p className="mt-4">
          You may cancel at any time through your account settings (where
          available) or by contacting us at{" "}
          <a
            href="mailto:lumerahq6@gmail.com"
            className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
          >
            lumerahq6@gmail.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Paddle as Merchant of Record",
    children: (
      <>
        <p>
          Payments for Kaimatsu products and subscriptions are processed by
          Paddle.com Market Limited and its affiliates (&quot;Paddle&quot;).
          Paddle acts as the merchant of record for your transaction: Paddle
          appears on your payment statement, collects and remits applicable
          taxes, and handles billing-related matters in line with Paddle&apos;s
          policies.
        </p>
        <p className="mt-4 rounded-lg border border-border-accent/40 bg-accent/5 px-4 py-3 text-text-primary">
          Paddle.com is the Merchant of Record for all our orders. Paddle
          provides all customer service inquiries and handles returns.
        </p>
      </>
    ),
  },
  {
    title: "Pricing and Payments",
    children: (
      <p>
        Prices are listed in U.S. dollars (USD) unless otherwise stated.
        Paddle may display and charge amounts in your local currency; any
        conversion is handled by Paddle. We may change our prices or fees with
        at least thirty (30) days&apos; notice where required; continued use or
        renewal after the effective date may constitute acceptance of the new
        price.
      </p>
    ),
  },
  {
    title: "License and Usage Rights",
    children: (
      <p>
        Subject to these terms and your active entitlement (including an
        active subscription where applicable), you receive a limited,
        non-exclusive license to use the plugins and assets for your own
        personal and commercial projects. You may not redistribute, resell,
        sublicense, or share plugin installers, license keys, or download links.
        Plugin licenses are per-seat, tied to your account or the activation
        method we provide, and are non-transferable unless we agree in writing.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    children: (
      <p>
        All software, plugins, assets, branding, documentation, and other
        materials made available through Kaimatsu are owned by Kaimatsu or its
        licensors. Your purchase or subscription grants a license to use the
        materials as permitted here—not ownership of the underlying
        intellectual property.
      </p>
    ),
  },
  {
    title: "Refund Policy",
    children: (
      <p>
        Digital products and subscription benefits are generally non-refundable
        once accessed or delivered, subject to applicable law and
        Paddle&apos;s policies. For our full refund rules and exceptions, see our{" "}
        <Link
          href="/refund-policy"
          className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
        >
          Refund Policy
        </Link>
        .
      </p>
    ),
  },
  {
    title: "Account Responsibility",
    children: (
      <p>
        You are responsible for maintaining the confidentiality of your
        account credentials and for all activity that occurs under your account.
        Notify us promptly at the contact below if you suspect unauthorized
        access.
      </p>
    ),
  },
  {
    title: "Termination",
    children: (
      <p>
        We may suspend or terminate your account or access to services if you
        violate these terms, abuse our systems, or create risk for us or other
        users. You may cancel your subscription at any time as described in
        Subscription Terms. Provisions that by their nature should survive
        (including license restrictions, disclaimers, and limitations of
        liability) will survive termination.
      </p>
    ),
  },
  {
    title: "Disclaimer of Warranties",
    children: (
      <p>
        Our services, plugins, assets, and coaching are provided &quot;as
        is&quot; and &quot;as available,&quot; without warranties of any kind,
        whether express or implied, to the fullest extent permitted by law. We
        do not guarantee specific editing results, uninterrupted access, or that
        products will meet every use case or third-party software version.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    children: (
      <p>
        To the maximum extent permitted by applicable law, Kaimatsu and its
        operator will not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or for loss of profits, data, or
        goodwill. Our aggregate liability arising out of or relating to these
        terms or the services in the twelve (12) months before the claim will
        not exceed the amount you paid to us (via Paddle) for the services
        giving rise to the claim during that period.
      </p>
    ),
  },
  {
    title: "Governing Law",
    children: (
      <p>
        These terms are governed by the laws of your jurisdiction, without
        regard to conflict-of-law rules, except where Paddle&apos;s terms of
        purchase or checkout terms apply to payment, billing, or merchant-of-record
        matters—in which case those Paddle terms control to the extent they
        conflict solely with respect to those topics.
      </p>
    ),
  },
  {
    title: "Changes to Terms",
    children: (
      <p>
        We may update these Terms & Conditions from time to time. The
        &quot;Last updated&quot; date at the top will reflect material
        revisions. Continued use of the site or an active subscription after
        changes become effective constitutes acceptance of the updated terms.
        For material changes, we will use reasonable efforts to notify you,
        including by email to the address associated with your account where
        possible.
      </p>
    ),
  },
  {
    title: "Contact Information",
    children: (
      <p>
        For questions about these terms or our services, contact Kaimatsu at{" "}
        <a
          href="mailto:lumerahq6@gmail.com"
          className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
        >
          lumerahq6@gmail.com
        </a>
        , on Telegram at{" "}
        <a
          href="https://t.me/bossboy21"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
        >
          @bossboy21
        </a>
        , or via our{" "}
        <Link
          href="/contact"
          className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
        >
          contact page
        </Link>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="relative isolate overflow-hidden bg-bg-primary px-6 py-16 md:py-24 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-24 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[100px]" />
        <div className="absolute bottom-0 right-[-10%] h-[280px] w-[280px] rounded-full bg-accent/[0.05] blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(139,92,246,0.1),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[800px]">
        <header className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Legal
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-[2.25rem]">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-sm text-text-muted">
            Last updated: March 25, 2026
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-left text-base leading-relaxed text-text-secondary md:text-center">
            These terms govern your use of Kaimatsu&apos;s website, subscriptions,
            and digital products. Please read them carefully before purchasing or
            using our services.
          </p>
        </header>

        <div className="rounded-2xl border border-border-primary bg-bg-card/90 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-sm md:p-10">
          <ol className="list-none space-y-0">
            {sections.map((section, index) => (
              <li
                key={section.title}
                className="border-b border-border-primary py-8 first:pt-0 last:border-b-0 last:pb-0"
              >
                <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary md:text-xl">
                  <span className="mr-2 inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-accent/15 px-2 text-sm font-bold tabular-nums text-accent">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 pl-0 text-[0.9375rem] leading-relaxed text-text-secondary md:pl-[2.75rem] [&_p+p]:mt-0">
                  {section.children}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          Questions?{" "}
          <Link
            href="/contact"
            className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
          >
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
