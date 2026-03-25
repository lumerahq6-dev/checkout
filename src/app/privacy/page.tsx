import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy – Kaimatsu",
  description:
    "How Kaimatsu collects, uses, and protects your personal data. GDPR-aligned privacy policy for our B2C SaaS platform.",
};

const sections: { title: string; children: React.ReactNode }[] = [
  {
    title: "Introduction",
    children: (
      <p>
        Kaimatsu (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your
        privacy. This policy explains what data we collect, why we collect it,
        how we use it, and what rights you have. This policy applies to all
        users of kaimatsu.com and related services, including our digital video
        editing plugins, asset packs, and Discord coaching subscriptions. For
        terms of use, see our{" "}
        <Link
          href="/terms"
          className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
        >
          Terms & Conditions
        </Link>
        .
      </p>
    ),
  },
  {
    title: "Information We Collect",
    children: (
      <div className="space-y-4">
        <ul className="list-disc space-y-3 pl-5 marker:text-accent/80">
          <li>
            <span className="font-medium text-text-primary">Account Data:</span>{" "}
            name, email address, and account credentials.
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Payment & Billing Data:
            </span>{" "}
            processed by Paddle (our Merchant of Record). We do not store
            credit card numbers. Paddle collects billing address, payment method
            details, and transaction history. See Paddle&apos;s privacy policy at{" "}
            <a
              href="https://paddle.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
            >
              paddle.com/legal/privacy
            </a>
            .
          </li>
          <li>
            <span className="font-medium text-text-primary">Usage Data:</span>{" "}
            pages visited, features used, session duration, device and browser
            information, and IP address.
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Communication Data:
            </span>{" "}
            messages sent through our contact or support forms and emails you
            send to us.
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Cookies & Analytics:
            </span>{" "}
            we use essential cookies for site functionality and analytics
            cookies to understand usage patterns.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "How We Use Your Information",
    children: (
      <ul className="list-disc space-y-3 pl-5 marker:text-accent/80">
        <li>
          To provide and maintain our services (plugins, asset delivery, and
          coaching access).
        </li>
        <li>To process transactions via Paddle.</li>
        <li>
          To communicate with you about your account, orders, and support
          requests.
        </li>
        <li>To improve our products and user experience.</li>
        <li>To comply with legal obligations.</li>
      </ul>
    ),
  },
  {
    title: "Legal Basis for Processing (GDPR)",
    children: (
      <ul className="list-disc space-y-3 pl-5 marker:text-accent/80">
        <li>
          <span className="font-medium text-text-primary">
            Contractual necessity:
          </span>{" "}
          processing required to deliver products and services you purchased.
        </li>
        <li>
          <span className="font-medium text-text-primary">
            Legitimate interest:
          </span>{" "}
          analytics, fraud prevention, and improving services.
        </li>
        <li>
          <span className="font-medium text-text-primary">Consent:</span>{" "}
          marketing communications (you can opt out at any time).
        </li>
        <li>
          <span className="font-medium text-text-primary">
            Legal obligation:
          </span>{" "}
          tax records and compliance.
        </li>
      </ul>
    ),
  },
  {
    title: "Third-Party Services",
    children: (
      <>
        <p>We share data with the following categories of providers:</p>
        <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-accent/80">
          <li>
            <span className="font-medium text-text-primary">Paddle</span> (
            <a
              href="https://paddle.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
            >
              paddle.com/legal/privacy
            </a>
            ) — payment processing and Merchant of Record.
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Analytics providers
            </span>{" "}
            — anonymized usage data.
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Email service providers
            </span>{" "}
            — transactional and support emails.
          </li>
        </ul>
        <p className="mt-4 font-medium text-text-primary">
          We do not sell your personal data to third parties.
        </p>
      </>
    ),
  },
  {
    title: "Data Retention",
    children: (
      <p>
        We retain your data for as long as your account is active or as needed
        to provide services. After account deletion, we retain certain data for
        up to 24 months for legal and accounting purposes, after which it is
        securely deleted.
      </p>
    ),
  },
  {
    title: "Your Rights",
    children: (
      <>
        <p>
          Depending on your location, you may have the right to access, correct,
          delete, restrict, or object to processing of your personal data, to
          data portability, and to withdraw consent at any time.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-accent/80">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your data (&quot;right to be forgotten&quot;)</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, contact us at{" "}
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
    title: "Cookies",
    children: (
      <>
        <ul className="list-disc space-y-3 pl-5 marker:text-accent/80">
          <li>
            <span className="font-medium text-text-primary">
              Essential cookies:
            </span>{" "}
            required for site functionality (login, preferences).
          </li>
          <li>
            <span className="font-medium text-text-primary">
              Analytics cookies:
            </span>{" "}
            help us understand how visitors use the site.
          </li>
        </ul>
        <p className="mt-4">
          You can manage cookie preferences through your browser settings.
        </p>
      </>
    ),
  },
  {
    title: "Children's Privacy",
    children: (
      <p>
        Our services are not directed at individuals under 16. We do not
        knowingly collect personal data from children.
      </p>
    ),
  },
  {
    title: "International Data Transfers",
    children: (
      <p>
        If you access our services from outside the country where our servers
        are located, your data may be transferred internationally. We ensure
        appropriate safeguards are in place.
      </p>
    ),
  },
  {
    title: "Security",
    children: (
      <p>
        We implement industry-standard security measures to protect your data.
        However, no method of transmission over the internet is 100% secure.
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    children: (
      <p>
        We may update this policy from time to time. Material changes will be
        communicated via email or a notice on our website. Continued use after
        changes constitutes acceptance.
      </p>
    ),
  },
  {
    title: "Contact Us",
    children: (
      <>
        <p>
          For any privacy-related questions or to exercise your rights, contact
          us:
        </p>
        <ul className="mt-4 list-none space-y-2">
          <li>
            <span className="font-medium text-text-primary">Email:</span>{" "}
            <a
              href="mailto:lumerahq6@gmail.com"
              className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
            >
              lumerahq6@gmail.com
            </a>
          </li>
          <li>
            <span className="font-medium text-text-primary">Telegram:</span>{" "}
            <a
              href="https://t.me/bossboy21"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
            >
              @bossboy21
            </a>
          </li>
        </ul>
        <p className="mt-4">
          You can also reach us via our{" "}
          <Link
            href="/contact"
            className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
          >
            contact page
          </Link>
          .
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-accent animate-fade-in-up stagger-1 [animation-fill-mode:both]">
            Legal
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-[2.25rem] animate-fade-in-up stagger-2 [animation-fill-mode:both]">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-text-muted animate-fade-in-up stagger-3 [animation-fill-mode:both]">
            Last updated: March 25, 2026
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-left text-base leading-relaxed text-text-secondary md:text-center animate-fade-in-up stagger-4 [animation-fill-mode:both]">
            This policy describes how Kaimatsu handles personal data when you
            use our website, purchase digital products or subscriptions, and
            interact with support. Paddle processes payments as Merchant of
            Record; see their policy for payment-specific details.
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
          <Link
            href="/terms"
            className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
          >
            Terms & Conditions
          </Link>
          {" · "}
          <Link
            href="/contact"
            className="font-medium text-accent underline decoration-border-accent underline-offset-2 transition-colors hover:text-accent-hover"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
