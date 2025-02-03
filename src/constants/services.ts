import { Rocket, Globe, LineChart } from 'lucide-react';

export const services = [
  {
    id: "digital-strategy",
    icon: Rocket,
    title: "Digital Strategy",
    description: "Shape a future-proof digital strategy",
    subtext: "We help businesses develop a clear roadmap for their digital products and services. From defining the vision to implementing a structured plan, we ensure your strategy is actionable, user-centered and results-driven.",
    features: [
      "Define your digital product vision & strategy",
      "Create structured roadmaps for growth & market positioning",
      "Align product development with customer needs and business goals",
      "Bring your users to life using user personas"
    ],
    cta: "Let's think!",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    path: "/digital-strategy"
  },
  {
    id: "websites",
    icon: Globe,
    title: "Websites",
    description: "Your onepager website, hassle free",
    subtext: "For small businesses and startups, a well-designed online presence is crucial. We create unique, professional, one-pager websites that look great and drive results, for an unbeatable price.",
    features: [
      "Beautiful, unique & mobile-friendly",
      "No-nonsense & effective",
      "No restrictive templates",
      "SEO-optimized",
      "Unbeatable price"
    ],
    cta: "Let's build!",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1200",
    path: "/websites"
  },
  {
    id: "business-audit",
    icon: LineChart,
    title: "Business Auditing & Consulting",
    description: "Optimize your business with expert insights and strategic guidance.",
    subtext: "We analyze your operations, workflows, and market positioning to uncover opportunities for growth and efficiency. Whether you need a full audit, consulting, or tailored business advice, we deliver actionable solutions.",
    features: [
      "In-depth business performance audits",
      "Process optimization for increased efficiency",
      "Strategic consulting for growth & digital transformation",
      "Independent expert advice to improve decision-making"
    ],
    cta: "Let's talk!",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    path: "/business-audit"
  }
] as const;