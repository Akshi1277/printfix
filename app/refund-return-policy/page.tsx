import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";
import { company } from "../content";

export const metadata: Metadata = { title: "Refund & Return Policy", alternates: { canonical: "/refund-return-policy/" } };

// Text from printfix.co.in/refund-return-policy
export default function Refund() {
  return (
    <LegalPage
      title="Refund & Return Policy"
      sections={[
        { h: "1. General policy", items: [
          "Due to the custom nature of our printing and packaging work, we do not offer refunds or exchanges for \"change of mind\" or customer-side errors (such as typos, low-resolution images or incorrect size selection) once an order has been approved and produced.",
        ] },
        { h: "2. Defective or damaged items", items: [
          "If your order arrives with a manufacturing defect or was damaged during transit, we will provide a reprint or a partial/full refund under the following conditions:",
          ["Notification:", `You must notify us at ${company.email} within 48 hours of receiving your order.`],
          ["Evidence:", "You must provide clear photographic or video evidence of the defect or damage, including the packaging if applicable."],
          ["Return of goods:", "In some cases, we may require the defective items to be returned to us for inspection before a reprint is issued."],
        ] },
        { h: "3. What qualifies as a defect?", items: [
          "A reprint or refund will be considered if:",
          "The finished product differs significantly from the approved digital proof.",
          "There are physical defects in the material (e.g. torn paper, faulty adhesive, incorrect lamination).",
          "The quantity delivered is less than 95% of the ordered amount (industry standard allows for a 5% margin of error).",
        ] },
        { h: "4. Non-refundable scenarios", items: [
          ["Colour variations:", "Minor differences between your computer screen (RGB) and the final print (CMYK)."],
          ["Shipping delays:", "Delays caused by third-party couriers or customs."],
          ["Late approval:", "Delays in production caused by the customer's late approval of proofs."],
        ] },
        { h: "5. Refund process", items: [
          "If a refund is approved, it will be processed via the original payment method within 5–10 business days. Shipping costs are non-refundable unless the error was entirely on our part.",
        ] },
      ]}
    />
  );
}
