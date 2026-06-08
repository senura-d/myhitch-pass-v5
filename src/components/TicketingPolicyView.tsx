"use client";

import PolicyLayout, { PolicySection, PolicyList } from "./PolicyLayout";

interface Props {
  setView: (view: string) => void;
}

export default function TicketingPolicyView({ setView }: Props) {
  return (
    <PolicyLayout
      eyebrow="Ticketing Policy"
      title="Fair, transparent ticketing"
      subtitle="This Ticketing Policy covers how tickets are sold, transferred, refunded, and validated on the MYHitch Pass platform."
      effectiveDate="15/12/2025"
      setView={setView}
    >
      <PolicySection number={1} title="About this policy">
        <p>
          This policy governs the purchase and use of all tickets sold through <span className="font-bold text-neutral-900">myhitchpass.com.au</span>. By buying a ticket on our platform, you agree to these terms.
        </p>
      </PolicySection>

      <PolicySection number={2} title="Ticket purchases">
        <PolicyList
          items={[
            "All ticket prices are displayed in Australian Dollars (AUD) and include applicable taxes unless stated otherwise.",
            "A booking is confirmed only after successful payment and you receive a confirmation email with your digital ticket.",
            "Each ticket is unique, tied to your account, and protected by a secure QR code or pass identifier.",
            "Tickets must be purchased only through MYHitch Pass — tickets resold or transferred outside the platform may be invalidated.",
          ]}
        />
      </PolicySection>

      <PolicySection number={3} title="Refunds and cancellations">
        <p>The refund policy depends on who initiated the cancellation:</p>
        <PolicyList
          items={[
            "Event cancelled by organiser: you will receive a full refund to your original payment method within 5–10 business days.",
            "Event rescheduled: your ticket is automatically valid for the new date. If you cannot attend, contact support within 14 days of the new date for a refund.",
            "Customer-initiated refund: refunds are at the organiser's discretion and may not be available for all events. Check the event page for the organiser's refund terms before purchasing.",
            "Refunds for change of mind are generally not provided once a confirmation email has been issued.",
          ]}
        />
      </PolicySection>

      <PolicySection number={4} title="Ticket transfers">
        <PolicyList
          items={[
            "Tickets can be transferred to another person via the “Transfer” option in your My Tickets dashboard.",
            "Once transferred, the new attendee's email and name will be on file for entry verification.",
            "Transfers are subject to a fair-use limit to prevent scalping. Excessive transfers may be blocked.",
            "Selling tickets above face value is prohibited and may result in cancellation of the ticket without refund.",
          ]}
        />
      </PolicySection>

      <PolicySection number={5} title="Entry and check-in">
        <PolicyList
          items={[
            "Present your QR code at the venue. The code is scanned once on entry — re-entry rules are set by each organiser.",
            "Photo ID matching the attendee name may be required for high-value events.",
            "Organisers reserve the right to refuse entry for invalid, duplicate, or fraudulently obtained tickets.",
            "Lost or stolen tickets: contact support@myhitchpass.com.au with your booking reference and we will reissue your digital pass.",
          ]}
        />
      </PolicySection>

      <PolicySection number={6} title="Organiser responsibilities">
        <PolicyList
          items={[
            "Organisers must accurately describe their events, including dates, venue, age restrictions, and any special conditions.",
            "Organisers are responsible for honouring tickets sold and for delivering the event as advertised.",
            "Payouts to organisers are processed via Stripe within 2–5 business days after each event concludes.",
            "MYHitch Pass acts as the ticketing platform — the event itself is a contract between attendee and organiser.",
          ]}
        />
      </PolicySection>

      <PolicySection number={7} title="Fees and charges">
        <PolicyList
          items={[
            "A small service fee may be added at checkout and is disclosed before purchase.",
            "Stripe's standard payment-processing fee applies to all transactions.",
            "Organisers may set additional fees (e.g. booking fees, VIP add-ons) which are displayed transparently before payment.",
          ]}
        />
      </PolicySection>

      <PolicySection number={8} title="Limitations of liability">
        <p>
          MYHitch Pass is not liable for the conduct or quality of events organised by third parties. Liability for any claim related to a ticket is limited to the amount paid for that ticket, except where prohibited by Australian consumer law.
        </p>
      </PolicySection>

      <PolicySection number={9} title="Contact and disputes">
        <p>
          For questions about this policy or to lodge a dispute, please contact{" "}
          <a href="mailto:support@myhitchpass.com.au" className="text-brand-blue font-extrabold hover:underline">
            support@myhitchpass.com.au
          </a>
          . We aim to respond to all enquiries within 2 business days.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
