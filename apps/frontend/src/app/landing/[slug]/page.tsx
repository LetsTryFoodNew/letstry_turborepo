import type { Metadata } from "next";
import {
    LandingBanner,
    LandingTableOfContents,
    LandingContent,
    LandingProducts,
    LandingFAQ,
} from "@/components/landing-page";

export const metadata: Metadata = {
    title: "Premium Healthy Snacks | Let's Try",
    description:
        "Discover our range of premium, healthy snacks. Deliciously crafted with natural ingredients for guilt-free snacking.",
};

const tocItems = [
    { id: "banner", label: "Home" },
    { id: "content", label: "About" },
    { id: "products", label: "Products" },
    { id: "faq", label: "FAQ" },
];

const contentBlocks = [
    {
        heading: "Snack Smarter, Live Better",
        body: "We believe that snacking should never mean compromising on health. Our range of premium snacks is crafted using the finest natural ingredients, offering you crunch, flavour, and nutrition in every bite.",
        subBlocks: [
            {
                subHeading: "Made with Real Ingredients",
                subBody:
                    "Every pack is prepared using carefully sourced, high-quality grains, seeds, and spices. No artificial colours, no preservatives — just real food.",
            },
            {
                subHeading: "Perfect for Every Occasion",
                subBody:
                    "Whether it's your morning tea time, an afternoon pick-me-up, or a movie night craving — our snacks fit right in.",
            },
        ],
    },
    {
        heading: "Our Promise to You",
        body: "We stand behind the quality of every single product that leaves our facility. From sourcing raw materials to the final pack that reaches your doorstep, every step is quality-controlled.",
        subBlocks: [
            {
                subHeading: "Freshness Guaranteed",
                subBody:
                    "Sealed in airtight packaging to lock in freshness and crunch. Every bite tastes like it was made today.",
            },
            {
                subHeading: "Affordable Premiumness",
                subBody:
                    "Great taste and health shouldn't break the bank. We keep our prices moderate so everyone can snack smart.",
            },
        ],
    },
];

const dummyProducts = [
    {
        name: "Quinoa Puffs — Tangy Tomato",
        slug: "quinoa-puffs-tangy-tomato",
        image: "/placeholder-product.png",
        price: 149,
        mrp: 199,
        tag: "Bestseller",
        websiteLink: "https://www.letstryfoods.com/product/hot-spicy-makhana",
        otherPlatformLinks: [
            {
                platform: "Amazon",
                link: "https://www.amazon.in/Let-Try-Spicy-Makhana-200g/dp/B0C5262626"
            },
            {
                platform: "Flipkart",
                link: "https://www.flipkart.com/let-try-spicy-makhana-200g/p/itm0123456789"
            }
        ]
    },
    {
        name: "Millet Crunchies — Classic Masala",
        slug: "millet-crunchies-classic-masala",
        image: "/placeholder-product.png",
        price: 129,
        mrp: 169,
        tag: "Trending",
        websiteLink: "https://www.letstryfoods.com/product/hot-spicy-makhana",
        otherPlatformLinks: [
            {
                platform: "Amazon",
                link: "https://www.amazon.in/Let-Try-Spicy-Makhana-200g/dp/B0C5262626"
            },
            {
                platform: "Flipkart",
                link: "https://www.flipkart.com/let-try-spicy-makhana-200g/p/itm0123456789"
            }
        ]
    },
    {
        name: "Ragi Chips — Cream & Onion",
        slug: "ragi-chips-cream-onion",
        image: "/placeholder-product.png",
        price: 119,
        mrp: 159,
        websiteLink: "https://www.letstryfoods.com/product/hot-spicy-makhana",
        otherPlatformLinks: [
            {
                platform: "Amazon",
                link: "https://www.amazon.in/Let-Try-Spicy-Makhana-200g/dp/B0C5262626"
            },
            {
                platform: "Flipkart",
                link: "https://www.flipkart.com/let-try-spicy-makhana-200g/p/itm0123456789"
            }
        ]
    },
    {
        name: "Oats Namkeen — Spicy Mix",
        slug: "oats-namkeen-spicy-mix",
        image: "/placeholder-product.png",
        price: 99,
        mrp: 139,
        websiteLink: "https://www.letstryfoods.com/product/hot-spicy-makhana",
        otherPlatformLinks: [
            {
                platform: "Amazon",
                link: "https://www.amazon.in/Let-Try-Spicy-Makhana-200g/dp/B0C5262626"
            },
            {
                platform: "Flipkart",
                link: "https://www.flipkart.com/let-try-spicy-makhana-200g/p/itm0123456789"
            }
        ]
    },
];

const faqItems = [
    {
        question: "Are your snacks healthy?",
        answer:
            "Absolutely! All our snacks are made from natural ingredients with no artificial preservatives, colours, or flavours. They are baked or air-fried to reduce oil content while maintaining great taste.",
    },
    {
        question: "What is the shelf life of your products?",
        answer:
            "Our products have a shelf life of 6 months from the date of manufacturing. Each pack is sealed in airtight packaging to ensure maximum freshness.",
    },
    {
        question: "Do you deliver pan-India?",
        answer:
            "Yes! We deliver across India. Orders are typically dispatched within 24 hours and delivered within 3–7 business days depending on your location.",
    },
    {
        question: "Can I order in bulk for corporate gifting?",
        answer:
            "Of course! We offer special bulk pricing and custom hamper options for corporate orders. Visit our Bulk & Corporate page or contact us directly for a quote.",
    },
    {
        question: "What payment methods do you accept?",
        answer:
            "We accept UPI, credit/debit cards, net banking, wallets, and cash on delivery (COD) for eligible pin codes.",
    },
];

export default function LandingPage() {
    return (
        <main>
            <LandingBanner
                headline="Deliciously Healthy Snacking"
                subtext="Premium, all-natural snacks crafted for those who refuse to compromise on taste or health."
                ctaText="Explore Our Range"
                ctaLink="#products"
            />

            <LandingTableOfContents items={tocItems} />

            <LandingContent
                title="Why Let's Try Is Your Go-To Snack Brand"
                blocks={contentBlocks}
            />

            <LandingProducts
                heading="Our Bestselling Products"
                products={dummyProducts}
            />

            {/* <LandingCTA
                headline="Ready to Snack Smarter?"
                description="Browse our full collection and get your favourites delivered straight to your door."
                shopNowLink="/"
                buyNowLink="/"
            /> */}

            <LandingFAQ heading="Frequently Asked Questions" faqs={faqItems} />
        </main>
    );
}
