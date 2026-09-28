import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import { company } from "../content";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy/" } };

// Text from printfix.co.in/privacy-policy (effective 25 March 2026).
// The old page contained an unfilled placeholder for artwork retention ("[Insert Time, e.g., 12 months]");
// that line is omitted here until Printfix confirms the period.
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="Effective date: 25 March 2026"
      intro="At Printfix, we are committed to protecting your privacy. This policy explains how we handle your personal information for our printing and packaging services."
      sections={[
        { h: "I. Information we collect", items: [
          ["Identity & contact:", "Name, email, phone number, and delivery / billing addresses."],
          ["Order content:", "Files, logos and artwork you send us for printing."],
          ["Technical data:", "IP address and browser type, collected automatically to improve site performance."],
        ] },
        { h: "II. How we use your information", items: [
          "Processing and delivering your custom printing and packaging orders.",
          "Providing quotes and customer support.",
          "Sending order updates and, with your consent, promotional offers.",
        ] },
        { h: "III. Sharing your data", items: [
          "We do not sell your personal data. We only share information with:",
          ["Delivery partners:", "To ship your finished products."],
          ["Payment processors:", "To securely handle transactions (we do not store full card details)."],
          ["Legal compliance:", "If required by law or to protect our rights."],
        ] },
        { h: "IV. Data security", items: [["Security:", "We use SSL encryption to protect your data during transmission."]] },
        { h: "V. Your rights", items: [
          "Under Indian law, you have the right to:",
          "Access the personal data we hold about you.",
          "Request correction of inaccurate information.",
          "Request deletion of your data once an order is complete.",
        ] },
        { h: "Contact us", items: [`For any privacy-related queries, email us at ${company.email}.`] },
      ]}
    />
  );
}
