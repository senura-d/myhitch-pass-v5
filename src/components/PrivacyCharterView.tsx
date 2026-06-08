"use client";

import PolicyLayout, { PolicySection, PolicyList } from "./PolicyLayout";

interface Props {
  setView: (view: string) => void;
}

export default function PrivacyCharterView({ setView }: Props) {
  return (
    <PolicyLayout
      eyebrow="Privacy Charter"
      title="Your privacy, our commitment"
      subtitle="This Privacy Charter explains what personal information MYHitch Pass collects, how we use and protect it, and the rights you have over your data."
      effectiveDate="15/12/2025"
      setView={setView}
    >
      <PolicySection number={1} title="Who we are">
        <p>
          MYHitch Pass Australia (“MYHitch Pass”, “we”, “our”, “us”) operates the ticketing and event discovery platform at <span className="font-bold text-neutral-900">myhitchpass.com.au</span>. This Privacy Charter applies to attendees, organisers, and visitors who use our website or services.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Information we collect">
        <p>We only collect information that helps us deliver a safe, reliable ticketing experience. This includes:</p>
        <PolicyList
          items={[
            "Account details: name, email address, phone number, business or organiser name where applicable.",
            "Booking details: events purchased, ticket type, quantity, and attendee names.",
            "Payment metadata: transaction reference, payment status, and last four digits of the card. Full card data is processed and stored by Stripe — never by MYHitch Pass.",
            "Technical data: device type, browser, IP address, and pages visited (used for security and analytics).",
            "Communications: messages you send to support@myhitchpass.com.au or through our help desk.",
          ]}
        />
      </PolicySection>

      <PolicySection number={3} title="How we use your information">
        <PolicyList
          items={[
            "To create and manage your account.",
            "To process ticket purchases and deliver digital passes.",
            "To pay organisers via Stripe and reconcile event sales.",
            "To send transactional emails (booking confirmations, reminders, refunds).",
            "To detect, prevent, and respond to fraud or platform abuse.",
            "To improve our services through aggregated, de-identified analytics.",
          ]}
        />
      </PolicySection>

      <PolicySection number={4} title="When we share your information">
        <p>We do not sell your personal data. We share limited information only with:</p>
        <PolicyList
          items={[
            "Event organisers: the attendee name and email for tickets you purchased to their event, so they can manage entry and communications.",
            "Stripe: to process payments and payouts securely under PCI-DSS Level 1 standards.",
            "Email and hosting providers: to deliver tickets and run the platform.",
            "Law enforcement or regulators: only when required by Australian law.",
          ]}
        />
      </PolicySection>

      <PolicySection number={5} title="How we protect your information">
        <PolicyList
          items={[
            "All traffic is encrypted in transit with HTTPS/TLS.",
            "Passwords are stored hashed and salted — never in plain text.",
            "Payment details are tokenised by Stripe; MYHitch Pass servers never see your full card number.",
            "Access to attendee data is restricted to authorised staff only, on a need-to-know basis.",
            "We continuously monitor for unauthorised access and apply security patches promptly.",
          ]}
        />
      </PolicySection>

      <PolicySection number={6} title="Your rights">
        <p>Under the Australian Privacy Act 1988 and the Australian Privacy Principles, you have the right to:</p>
        <PolicyList
          items={[
            "Access the personal information we hold about you.",
            "Correct information that is inaccurate or out of date.",
            "Request deletion of your account and associated data, subject to legal record-keeping obligations.",
            "Opt out of marketing emails at any time (transactional emails will still be sent).",
            "Lodge a complaint with the Office of the Australian Information Commissioner (OAIC).",
          ]}
        />
      </PolicySection>

      <PolicySection number={7} title="Cookies and tracking">
        <p>
          MYHitch Pass uses essential cookies to keep you signed in and remember your session. We also use lightweight analytics to understand how the platform is used. You can clear or block cookies in your browser settings, though some features may not work without them.
        </p>
      </PolicySection>

      <PolicySection number={8} title="Data retention">
        <p>
          We keep personal data only as long as we need it for the purposes described above, or as required by Australian law. When data is no longer needed, it is securely deleted or de-identified.
        </p>
      </PolicySection>

      <PolicySection number={9} title="Changes to this Charter">
        <p>
          We may update this Privacy Charter from time to time. The latest version will always be available at <span className="font-bold text-neutral-900">myhitchpass.com.au/privacy-charter</span>. Material changes will be communicated by email or an in-app notice.
        </p>
      </PolicySection>

      <PolicySection number={10} title="Contact us">
        <p>
          Questions about this Charter or your data? Reach our team at{" "}
          <a href="mailto:support@myhitchpass.com.au" className="text-brand-blue font-extrabold hover:underline">
            support@myhitchpass.com.au
          </a>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
