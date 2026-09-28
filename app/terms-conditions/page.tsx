import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms-conditions/" } };

// Text from printfix.co.in/terms-conditions
export default function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        { h: "1. Artwork & proofing", items: [
          ["Final approval:", "Printfix will provide a digital proof for all custom orders. It is the customer's sole responsibility to check for errors in spelling, grammar, layout and image resolution."],
          ["Production start:", "Once \"Approval for Production\" is received (via email or website), the order is final. Printfix is not liable for any errors overlooked during the proofing stage."],
          ["Colour accuracy:", "Due to variations in monitor calibration (RGB) versus professional printing (CMYK), exact colour matching is not guaranteed. Minor colour variations are not grounds for a refund."],
        ] },
        { h: "2. Payment & cancellation", items: [
          ["Payment terms:", "Full payment is required before production begins unless otherwise agreed in writing."],
          ["Cancellations:", "Because all orders are custom-made to your specifications, cancellations are not permitted once production has started. If a cancellation is requested before production, a processing fee may apply."],
        ] },
        { h: "3. Production & delivery", items: [
          ["Turnaround times:", "All delivery dates provided are estimates. While we strive to meet deadlines, Printfix is not liable for financial losses caused by production delays or third-party courier issues."],
          ["Shipping damage:", "Claims for items damaged during transit must be made within 48 hours of receipt, accompanied by photographic evidence of the packaging and product."],
        ] },
        { h: "4. Intellectual property", items: [
          ["Customer warranty:", "By submitting artwork, the customer warrants that they own the rights to the designs, logos and images. Printfix reserves the right to refuse any order that appears to infringe on a third party's copyright or contains illegal content."],
          ["Portfolio use:", "Unless requested otherwise in writing, Printfix reserves the right to use photos of finished products in our marketing materials and portfolio."],
        ] },
        { h: "5. Limitation of liability", items: [
          ["Printfix's total liability:", "For any claim shall not exceed the total price of the order placed. We are not responsible for indirect or consequential losses."],
        ] },
      ]}
    />
  );
}
