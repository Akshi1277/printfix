/**
 * All business content lives here, separate from the components.
 *
 * Every fact below is taken from the current site, printfix.co.in (audited Sept 2026):
 * homepage, About, the five service pages, Contact, and the Terms / Refund / Privacy pages.
 * Nothing here is invented — if Printfix adds a fact (address, MOQ number, lead time),
 * add it here and it appears across the site.
 */

export const company = {
  name: "Printfix",
  legalName: "Printfix Printing & Packaging Solutions",
  tagline: "Design · Print · Promote",
  motto: "Where precision meets prestige.",
  description:
    "Printfix is a premium printing and packaging company specialising in high-quality print solutions and luxury packaging designed to elevate brand identity.",
  seoDescription:
    "Printfix offers offset printing, premium packaging and branding solutions for businesses across India — rigid boxes, corrugated boxes, product boxes, paper bags and book printing, at low MOQ.",
  url: "https://printfix.co.in",
  email: "printfix2021@gmail.com",
  phone: "+91 97692 77001",
  phoneHref: "tel:+919769277001",
  // The site lists this number and clients mention working with Printfix over WhatsApp.
  whatsapp: "919769277001",
  hours: "Monday to Saturday, 9 am – 6 pm",
  hoursShort: "Mon – Sat · 9 am – 6 pm",
  region: "Businesses across India",
  logo: { color: "/brand/logo.png", white: "/brand/logo-white.png", ratio: 1444 / 358 },
};

export const whatsappLink = (text = "Hello Printfix, I'd like a quote for a printing / packaging project.") =>
  `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Offset Printing", href: "/offset-printing/" },
  { label: "Work", href: "/work/" },
  { label: "Industries", href: "/#industries" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export const quoteHref = "/contact/#quote";

export const hero = {
  label: "Offset printing & custom packaging",
  title: ["Where precision", "meets prestige."],
  body: "We deliver customised printing and packaging to businesses at low MOQ — from offset-printed cartons and paper bags to luxury rigid boxes and books.",
  image: { src: "/work/velina-1.webp", alt: "Green rigid perfume box with gold foil floral pattern, open to show a glass attar bottle in a fitted cream insert" },
  inset: { src: "/work/glide-red-3.webp", alt: "Red rigid box opened to show a black die-cut foam insert" },
};

/** Only verified facts — no invented statistics. */
export const trust = [
  { big: "Low MOQ", small: "Customised printing and packaging for businesses without large minimum orders." },
  { big: "Offset printed", small: "High-quality offset printing for sharp, consistent colour on cartons, boxes and bags." },
  { big: "Design → Delivery", small: "Design, print and packaging handled end-to-end, from sample to delivery." },
  { big: "Pan-India", small: "Serving businesses across India. Open Monday to Saturday, 9 am – 6 pm." },
];

export const intro = {
  label: "Who we are",
  title: "Your reliable printing & packaging partner.",
  body: [
    "We specialise in custom printing, packaging boxes, branding materials and commercial print designed to enhance brand visibility. From concept to final production, our focus remains on quality, precision and timely delivery.",
    "With industry experience and modern printing technology, we help businesses create impactful packaging, marketing materials and branded assets that strengthen their market presence.",
  ],
};

/**
 * Offset printing. Printfix's own project specs name "high-quality offset printing" on cartons,
 * corrugated boxes and paper bags, a Pantone colour on the Nzuri box, and white ink on
 * coloured and kraft stock; the terms explain CMYK proofing. The "how it works" lines are
 * general facts about the process, not claims about Printfix's equipment.
 */
export const offset = {
  label: "Offset printing",
  title: "Sharp, consistent colour — printed offset.",
  lede: "High-quality offset printing is behind much of Printfix's packaging — product cartons, corrugated mailers and paper bags — with foil, spot UV and lamination added on top.",
  image: { src: "/work/sufr-glow-2.webp", alt: "Orange offset-printed sheet-mask gift carton, open to show three printed sachets" },
  detail: { src: "/work/lavender-soap-1.webp", alt: "Pink and lavender offset-printed soap carton beside a bar of soap" },
  points: [
    { title: "Sharp, consistent colour", body: "Offset transfers ink from a plate to a rubber blanket and then to the sheet, giving crisp text, clean fine lines and even colour across a run." },
    { title: "CMYK & Pantone", body: "Full-colour CMYK for photography and illustration, and Pantone colours where a brand shade has to be exact — like the dark green Pantone on our Nzuri boxes." },
    { title: "Coated, kraft & coloured stock", body: "Printed on art paper, board and corrugated liners — including white ink on coloured and kraft stocks." },
    { title: "Finished after print", body: "Offset sheets then take matte, gloss or soft-touch lamination, spot UV, foil stamping and embossing." },
  ],
  steps: [
    { title: "Artwork & digital proof", body: "You approve a digital proof before anything is printed. Screens show RGB and print uses CMYK, so minor colour variation is normal." },
    { title: "Print", body: "The approved artwork is printed offset on the chosen stock." },
    { title: "Finish & convert", body: "Lamination, spot UV, foil or embossing, then cutting and forming into boxes, cartons or bags." },
    { title: "Check & deliver", body: "A final quality check, then on-time delivery." },
  ],
  faq: {
    q: "Do you do offset printing?",
    a: "Yes. Much of our packaging is offset printed — product cartons, corrugated mailers and paper bags — for sharp, consistent colour, with finishes like lamination, spot UV and foil added on top. For some kraft mailers we use digital printing instead. Tell us your product and quantity and we'll suggest the right route.",
  },
};

export type ServiceSlug = "rigid-box" | "corrugated-box" | "product-box" | "paper-bags" | "books-publishing";

export type Service = {
  slug: ServiceSlug;
  n: string;
  title: string;
  statement: string;
  body: string;
  image: { src: string; alt: string };
  seoTitle: string;
};

export const services: Service[] = [
  {
    slug: "rigid-box",
    n: "01",
    title: "Rigid Box",
    statement: "Not just a box — a statement of luxury.",
    body: "Premium rigid boxes designed for luxury packaging and high-end products. Ideal for gifting, retail and brand presentation with superior finishing options.",
    image: { src: "/work/aethara-1.webp", alt: "Navy rigid box with an art-nouveau gold foil illustration and the Aethara wordmark" },
    seoTitle: "Custom Rigid Boxes — Magnetic & Luxury Packaging",
  },
  {
    slug: "corrugated-box",
    n: "02",
    title: "Corrugated Box",
    statement: "Turn every delivery into a brand statement.",
    body: "Durable and cost-effective corrugated boxes for shipping and bulk packaging. Built for strength, protection and reliable delivery across all industries.",
    image: { src: "/work/nzuri-1.webp", alt: "Deep green corrugated mailer box with gold line illustration, open to show a printed inner lid" },
    seoTitle: "Custom Corrugated Boxes & Printed Mailer Boxes",
  },
  {
    slug: "product-box",
    n: "03",
    title: "Product Box",
    statement: "Elevate your product with premium packaging.",
    body: "Custom product boxes tailored to enhance brand visibility and shelf appeal. Perfect for retail packaging with flexible design and printing options.",
    image: { src: "/work/luv-cbd-1.webp", alt: "Deep green product carton with gold foil botanical line art next to a matching cosmetic jar" },
    seoTitle: "Custom Product Boxes — Cosmetic, Skincare & Retail Cartons",
  },
  {
    slug: "paper-bags",
    n: "04",
    title: "Paper Bags",
    statement: "Turn every carry into a brand experience.",
    body: "Paper bags crafted for retail, events and brand promotions. Strong, stylish and customisable to match your brand identity.",
    image: { src: "/work/b-boutique-1.webp", alt: "Ivory paper bag with black ribbon handles and a small black monogram" },
    seoTitle: "Custom Printed Paper Bags — Luxury & Kraft",
  },
  {
    slug: "books-publishing",
    n: "05",
    title: "Books / Publishing",
    statement: "Because great content deserves great print.",
    body: "Professional book printing and publishing with precision binding and premium paper quality. Ideal for authors, businesses and institutions.",
    image: { src: "/work/deeniyat-amma-1.webp", alt: "Blue hardcover book with a gold foil star emblem and Arabic calligraphy" },
    seoTitle: "Book Printing & Publishing — Hardcover, Brochures, Workbooks",
  },
];

export const industries = [
  { n: "01", title: "Publishing", note: "Educational books, workbooks, cookbooks and brochures.", image: { src: "/work/deeniyat-daily-1.webp", alt: "Brown hardcover book with a white jacket band, standing on a wooden shelf" } },
  { n: "02", title: "Health & Beauty", note: "Skincare cartons, cosmetic boxes and gift kits.", image: { src: "/work/antheara-1.webp", alt: "Dark brown cosmetic cartons for a cocoa body scrub" } },
  { n: "03", title: "Fashion & Apparels", note: "Boutique bags, abaya boxes and apparel mailers.", image: { src: "/work/nuda-1.webp", alt: "White paper shopping bag with red satin ribbon handles and the nuda. wordmark" } },
  { n: "04", title: "Food & Beverages", note: "Kraft carry bags and gifting packaging.", image: { src: "/work/origami-kraft-1.webp", alt: "Kraft paper carry bag with a printed restaurant logo and cord handles" } },
  { n: "05", title: "Pharmaceutical", note: "Printed medicine and supplement cartons.", image: { src: "/work/colact-1.webp", alt: "Offset-printed white and purple medicine carton" } },
];

export type Finish = { key: string; title: string; body: string; image: { src: string; alt: string } };

/** Finishes that appear in Printfix's own project specifications. */
export const finishes: Finish[] = [
  { key: "foil", title: "Foil stamping", body: "Gold and light-gold foil on logos, borders and illustration.", image: { src: "/work/velina-4.webp", alt: "Macro of gold foil floral line work on a green rigid box edge" } },
  { key: "emboss", title: "Blind embossing", body: "Raised lettering with no ink — texture you read with your fingers.", image: { src: "/work/ruixuecui-2.webp", alt: "Cream rigid box with large blind-embossed lettering catching the light" } },
  { key: "deboss", title: "Debossing", body: "Pressed-in artwork on covers and boards.", image: { src: "/work/deeniyat-daily-2.webp", alt: "Blind debossed mosque and minaret design on a brown book cover" } },
  { key: "spot-uv", title: "Spot UV", body: "A selective gloss layer that lifts a logo or pattern off a matte surface.", image: { src: "/work/paloma-2.webp", alt: "Navy paper bag with a tonal bird pattern, spot UV details and gold foil lettering" } },
  { key: "lamination", title: "Soft-touch & matte lamination", body: "Velvety, low-sheen surfaces for rigid boxes, bags and covers.", image: { src: "/work/b-boutique-2.webp", alt: "Ivory soft-touch laminated paper bag with a black ribbon handle" } },
  { key: "white-ink", title: "Offset & white-ink printing", body: "High-quality offset printing, including white ink on coloured and kraft stocks.", image: { src: "/work/le-rose-1.webp", alt: "Blue corrugated mailer printed with white-ink leaves" } },
];

/** Printfix's own five-step process, from the About page. */
export const process = [
  { n: "01", title: "Understand", body: "Understanding client requirements and product details." },
  { n: "02", title: "Design & sample", body: "Designing and sampling for client approval." },
  { n: "03", title: "Material & print", body: "Material selection and printing process." },
  { n: "04", title: "Finish & pack", body: "Finishing and packaging." },
  { n: "05", title: "Check & deliver", body: "Final quality check and on-time delivery." },
];

/** From the "Why choose Printfix" section. */
export const why = {
  label: "Why Printfix",
  title: "Premium work, planned properly, priced fairly.",
  points: [
    { title: "On-time delivery", body: "Planned production ensures timely delivery without quality compromise." },
    { title: "Premium. Fair. Value.", body: "Luxury printing and packaging at competitive prices." },
    { title: "Print & pack, unified", body: "End-to-end design, print and packaging — fast, smooth, reliable." },
    { title: "Customisation expertise", body: "Custom print and packaging tailored to your product, budget and brand." },
    { title: "Experienced management", body: "A team focused on quality control, clear communication and continuous improvement." },
  ],
};

export const craft = {
  label: "The detail",
  title: "Made to be picked up.",
  body: "Every product goes through quality checks for sharp colour, clean text, precise finishing and durable materials.",
  image: { src: "/work/ruixuecui-3.webp", alt: "Cream rigid box with embossed lettering, lid open to show a tray of chocolates" },
  labels: [
    { text: "Blind emboss", x: "22%", y: "9%" },
    { text: "Hinged lid", x: "70%", y: "12%" },
    { text: "Wrapped board", x: "6%", y: "62%" },
    { text: "Fitted tray", x: "64%", y: "66%" },
  ],
};

export const testimonials = [
  { quote: "Printfix has been our go-to resource for years. They are professional, accurate, and quick, handling everything from small jobs to tight deadlines without any fuss.", name: "Rashid Patel", role: "Director", company: "Vero Forza" },
  { quote: "I am so impressed with the quality and material of the custom packaging. They even caught a design error in my final file before printing, which saved us from a huge mistake.", name: "Rushab Nandu", role: "Director", company: "RN Kids" },
  { quote: "The team is incredibly knowledgeable. They helped us resolve a complex issue with our commercial printer and provided sound advice for our branding.", name: "Sandeep Jawake", role: "Procurement Manager", company: "Leben Life Sciences" },
  { quote: "Very reasonable pricing for such high-quality output. I'm especially pleased with how fast we received our order without compromising on the finish.", name: "Ashfaque Shaikh", role: "Procurement Manager", company: "Birra Fragrances LLP" },
  { quote: "Excellent communication via WhatsApp and email. The service standard is second to none, and they are always on hand to offer creative advice for our branding.", name: "Ibrahim Patel", role: "CEO", company: "Deeniyat" },
];

/** Logos shown with the testimonials on printfix.co.in — the same five clients. */
export const clients = [
  { name: "Vero Forza", src: "/clients/vero-forza.png" },
  { name: "RN Kids", src: "/clients/rn-kids.png" },
  { name: "Leben Life Sciences", src: "/clients/leben.png" },
  { name: "Birra Fragrances", src: "/clients/birra.png" },
  { name: "Deeniyat", src: "/clients/deeniyat.png" },
];

/** Answers come from Printfix's Terms & Conditions and Refund & Return Policy. */
export const faqs = [
  offset.faq,
  { q: "Do you take small orders?", a: "Yes. Printfix delivers customised printing and packaging at low MOQ, so you don't need a large run to get premium packaging. Share your quantity and we'll quote for it." },
  { q: "Will I see a proof before printing?", a: "Yes. We provide a digital proof for every custom order. Production starts only after you approve it, so please check spelling, layout and image resolution carefully." },
  { q: "Will the printed colour match my screen exactly?", a: "Screens show colour in RGB while professional printing uses CMYK, so exact matching isn't guaranteed. Minor variation between screen and print is normal." },
  { q: "How does payment work?", a: "Full payment is required before production begins, unless otherwise agreed in writing." },
  { q: "Can I cancel an order?", a: "Every order is custom-made, so cancellations aren't possible once production has started. Before production, a processing fee may apply." },
  { q: "How long does delivery take?", a: "Delivery dates are planned per project and shared with your quote. Tell us your deadline when you enquire and we'll plan production around it." },
  { q: "What if my order arrives damaged?", a: "Notify us within 48 hours of receiving it, with photos or video of the damage and the packaging. For manufacturing defects or transit damage we provide a reprint or a partial or full refund." },
];

export const footer = {
  blurb: "Custom printing and luxury packaging for businesses that value quality, presentation and brand image.",
  legal: [
    { label: "Terms & Conditions", href: "/terms-conditions/" },
    { label: "Refund & Return Policy", href: "/refund-return-policy/" },
    { label: "Privacy Policy", href: "/privacy-policy/" },
  ],
};
