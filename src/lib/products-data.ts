
import { Cpu, Sun, Lightbulb, LucideIcon, Wifi, Zap, ShieldCheck, GaugeCircle, Waves, Radar, Combine, Router, ToyBrick, Network } from 'lucide-react';

export type ProductFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ProductSpecification = {
  key: string;
  value: string;
};

export type ProductQna = {
  question: string;
  answer: string;
};

export type SubProduct = {
  title: string;
  description: string;
  features: ProductFeature[];
  specifications: ProductSpecification[];
};

export type EcosystemDetail = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type Product = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  icon: LucideIcon;
  images: { url: string; alt: string; hint: string }[];
  longDescription: string;
  features: ProductFeature[];
  specifications: ProductSpecification[];
  qna: ProductQna[];
  subProducts?: SubProduct[];
  ecosystem?: {
    architecture: {
      title: string;
      description: string;
      comparison: ProductSpecification[];
    };
    sharedHardware: {
      title: string;
      description: string;
      details: EcosystemDetail[];
    },
    gatewayHardware: {
      title: string;
      description: string;
      details: EcosystemDetail[];
    },
    workflow: {
      title: string;
      description: string;
      details: EcosystemDetail[];
    }
  };
};

export const products: Product[] = [
  {
    slug: 'auralis-ecosystem',
    title: 'Auralis Ecosystem',
    category: 'Intelligent Urban Lighting',
    shortDescription: 'A scalable, industrial-grade architecture for modernizing urban street lighting using a cost-effective Hybrid-Mesh Topology.',
    icon: Cpu,
    images: [
      { url: 'https://picsum.photos/seed/smartlight1/1200/800', alt: 'A modern smart street light in a city at dusk', hint: 'smart light' },
      { url: 'https://picsum.photos/seed/smartlight2/1200/800', alt: 'Dashboard showing control panel for smart street lights', hint: 'iot dashboard' },
      { url: 'https://picsum.photos/seed/smartlight3/1200/800', alt: 'Network of connected smart street lights on a map', hint: 'connected network' },
    ],
    longDescription: "The Auralis Ecosystem introduces a scalable, industrial-grade architecture for modernizing urban street lighting. Unlike traditional point-to-point systems that require expensive cellular hardware on every pole, Auralis utilizes a cost-effective Hybrid-Mesh Topology. This ecosystem is composed of two distinct hardware variants: Auralis Core (Worker Node) and Auralis Pro (Gateway Node). By deploying these units in a 1:50 ratio, municipalities can achieve 100% grid visibility and up to 80% energy savings while reducing hardware costs by significantly minimizing cellular data subscriptions.",
    features: [],
    specifications: [],
    qna: [
      { question: 'How much energy can be saved with this ecosystem?', answer: 'Cities can typically achieve energy savings of up to 80% through intelligent dimming, real-time monitoring, and optimized grid performance.' },
      { question: 'What is the primary advantage of the Hybrid-Mesh Topology?', answer: 'The key advantage is cost reduction. By using one gateway (Auralis Pro) for every 50 lights (Auralis Core), you drastically reduce the number of expensive cellular subscriptions needed, lowering both initial hardware costs and ongoing operational expenses.' },
      { question: "How does Auralis's predictive maintenance work?", answer: "Our AI-powered platform analyzes real-time operational data from each Auralis device. By identifying patterns that precede a failure, the system can issue a maintenance alert, allowing teams to fix problems proactively before an outage occurs." },
      { question: "Is Auralis compatible with existing city infrastructure?", answer: "Yes. Auralis is designed for seamless integration. Our smart street lights can replace existing fixtures with minimal retrofitting, and the platform can integrate with other city management systems via standard APIs." }
    ],
    ecosystem: {
      architecture: {
        title: "System Architecture: The Cluster Model",
        description: "The system operates on a decentralized \"Cluster\" model. Up to 50 Core nodes form a self-healing local mesh network, while a single Pro node acts as the gateway to the cloud, ensuring maximum resilience and minimal latency.",
        comparison: [
            { key: 'Primary Role', value: 'Local Control & Relay vs. Data Aggregation & Backhaul' },
            { key: 'Deployment Ratio', value: '~50 per Cluster vs. 1 per Cluster' },
            { key: 'Connectivity', value: 'Mesh Protocol (Local) vs. Mesh (Local) + 4G LTE Cat 1 (Cloud)' },
            { key: 'Power Consumption', value: '< 1.5W (Standby) vs. ~2.5W (Average), 10W Peak' },
            { key: 'Power Supply', value: '3W Isolated AC-DC vs. 10W Reinforced High-Current PSU' },
        ]
      },
      sharedHardware: {
          title: "Shared Hardware Technologies",
          description: "Both Core and Pro units share a foundational \"Base Architecture\" to ensure consistent performance, safety, and durability across the entire grid.",
          details: [
              { icon: Cpu, title: "Industrial Control Logic", description: "Powered by an Industrial-Grade Dual-Core IoT Controller running at 240MHz for complex local algorithms." },
              { icon: GaugeCircle, title: "The Dimming Engine", description: "Precise, flicker-free 0-100% brightness control via a robust AC Phase-Cutting architecture with Zero-Crossing Detection." },
              { icon: Combine, title: "The Sensing Suite", description: "A hybrid design with Microwave Doppler Radar (for motion), a light sensor (for daylight gating), and a Hall-Effect sensor for real-time fault monitoring." },
              { icon: ShieldCheck, title: "Safety & Protection", description: "Equipped with MOV for surge protection, a slow-blow fuse, and a snubber circuit to protect against inductive kickback." }
          ]
      },
      gatewayHardware: {
          title: "Specialized Hardware: Auralis Pro (Gateway)",
          description: "The Auralis Pro incorporates specific upgrades to handle its role as the cluster's communication anchor.",
          details: [
              { icon: Zap, title: "Reinforced Power Architecture", description: "A specialized 10W power module and high-current LDO regulator handle the intense energy bursts required for cellular transmission." },
              { icon: Router, title: "Cellular Backhaul", description: "An industrial LTE Cat 1 modem provides reliable, low-latency cloud connectivity, with RF isolation techniques to ensure signal integrity." }
          ]
      },
      workflow: {
          title: "Operational Workflow",
          description: "The ecosystem is designed for automated initialization, self-healing, and efficient data flow.",
          details: [
              { icon: Network, title: "Initialization & Self-Healing", description: "The Pro node establishes a cellular link and becomes the Mesh Root. Core nodes automatically find the strongest signal path, forming a self-healing tree topology." },
              { icon: ToyBrick, title: "Data Flow & Aggregation", description: "Sensed data is encrypted and hopped across the mesh to the Pro Gateway, which buffers packets and performs a batch upload to the cloud via MQTT, optimizing data usage." }
          ]
      }
    },
    subProducts: [
      {
        title: 'Auralis V1',
        description: 'The standard, cost-effective smart lighting solution for broad-scale urban deployment.',
        features: [
          { icon: Router, title: 'Hybrid Connectivity', description: 'Integrated Wi-Fi and GSM for reliable data backhaul.' },
          { icon: Radar, title: 'Radar-based Motion Detection', description: 'Accurate presence detection for adaptive lighting.' },
          { icon: GaugeCircle, title: 'Intelligent Dimming', description: 'Programmable dimming schedules to save energy.' },
        ],
        specifications: [
            { key: 'Input Voltage', value: '230V AC' },
            { key: 'Connectivity', value: 'Wi-Fi + GSM' },
            { key: 'Motion Sensor', value: 'Doppler Radar' },
        ]
      },
      {
        title: 'Auralis V2',
        description: 'An advanced model featuring enhanced sensor capabilities for high-traffic or complex environments.',
        features: [
          { icon: Router, title: 'Hybrid Connectivity', description: 'Integrated Wi-Fi and GSM for reliable data backhaul.' },
          { icon: Combine, title: 'Sensor Fusion (Radar + PIR)', description: 'Combines two sensor technologies for superior accuracy and elimination of false triggers.' },
          { icon: GaugeCircle, title: 'Intelligent Dimming', description: 'Programmable dimming schedules to save energy.' },
        ],
        specifications: [
            { key: 'Input Voltage', value: '230V AC' },
            { key: 'Connectivity', value: 'Wi-Fi + GSM' },
            { key: 'Motion Sensor', value: 'Doppler Radar + PIR' },
        ]
      }
    ]
  },
  {
    slug: 'solar-street-light',
    title: 'Solar Street Light',
    category: 'Sustainable Lighting',
    shortDescription: 'Autonomous, off-grid lighting solutions powered by the sun, integrated with smart control technology.',
    icon: Sun,
    images: [
      { url: 'https://picsum.photos/seed/solar1/1200/800', alt: 'Row of solar street lights along a rural road at dusk', hint: 'rural road' },
      { url: 'https://picsum.photos/seed/solar2/1200/800', alt: 'Close-up of a solar panel on top of a street light', hint: 'solar panel' },
      { url: 'https://picsum.photos/seed/solar3/1200/800', alt: 'A solar street light illuminating a community park at night', hint: 'community park' },
    ],
    longDescription: 'Our Solar Street Lights offer a sustainable and cost-effective solution for illuminating areas without access to the traditional power grid. Each unit is fully autonomous, with an integrated solar panel, high-capacity battery, and an efficient LED lamp. When combined with our Auralis control platform (via LoRaWAN), they become a powerful, remotely managed smart lighting grid.',
    features: [
      { icon: Sun, title: 'Off-Grid Operation', description: 'Completely independent of the power grid, making it perfect for rural areas, highways, and remote locations.' },
      { icon: GaugeCircle, title: 'Intelligent Power Management', description: 'Smart controllers optimize charging and discharging cycles to ensure reliability even on cloudy days.' },
      { icon: Cpu, title: 'Remote Monitoring', description: 'When paired with our smart platform, you can monitor battery status, performance, and control lighting schedules remotely.' },
    ],
    specifications: [
      { key: 'Solar Panel', value: 'Monocrystalline, >22% efficiency' },
      { key: 'Battery', value: 'LiFePO4, >8 years lifespan' },
      { key: 'Luminosity', value: '3,000 - 12,000 lumens' },
      { key: 'Autonomy', value: '3-5 nights on a single full charge' },
      { key: 'Motion Sensor', value: 'Optional PIR motion sensor for adaptive dimming' },
    ],
    qna: [
      { question: 'How long does the battery last?', answer: 'Our high-performance LiFePO4 batteries are designed for a lifespan of over 8 years. A single full charge can power the light for 3 to 5 continuous nights, ensuring reliability.' },
      { question: 'What kind of maintenance is required?', answer: 'Maintenance is minimal. We recommend periodic cleaning of the solar panel to ensure maximum efficiency. The smart system will report any other issues automatically if connected.' },
    ],
  },
  {
    slug: 'led-street-light',
    title: 'LED Street Light',
    category: 'High-Efficiency Lighting',
    shortDescription: 'Durable and energy-efficient LED street lights designed for longevity and superior illumination.',
    icon: Lightbulb,
    images: [
      { url: 'https://picsum.photos/seed/ledlight1/1200/800', alt: 'A bright, efficient LED street light head', hint: 'led light' },
      { url: 'https://picsum.photos/seed/ledlight2/1200/800', alt: 'A well-lit street at night using LED lights', hint: 'lit street' },
      { url: 'https://picsum.photos/seed/ledlight3/1200/800', alt: 'Comparison between old lighting and new LED lighting', hint: 'light comparison' },
    ],
    longDescription: 'Our LED Street Lights are the perfect upgrade for cities looking to replace outdated and inefficient lighting systems. Engineered for durability, high performance, and maximum energy savings, these lights provide superior visibility and have a long operational lifespan. They serve as a foundational step towards a smarter city, with options to upgrade to full smart-light capabilities in the future.',
    features: [
      { icon: GaugeCircle, title: 'High Energy-Efficiency', description: 'Reduces electricity consumption by up to 70% compared to traditional sodium or metal-halide lamps.' },
      { icon: Zap, title: 'Long Lifespan', description: 'Designed to last over 50,000 hours, significantly reducing replacement and maintenance costs.' },
      { icon: ShieldCheck, title: 'Robust & Durable', description: 'With an IP66 rating, these lights are built to withstand harsh weather conditions, ensuring reliable performance year-round.' },
    ],
    specifications: [
      { key: 'Luminous Efficacy', value: '>150 lm/W' },
      { key: 'CRI', value: '>70' },
      { key: 'Lifespan (L70)', value: '>50,000 hours' },
      { key: 'IP Rating', value: 'IP66' },
      { key: 'Surge Protection', value: '10kV' },
    ],
    qna: [
      { question: 'Can these lights be upgraded to "smart" lights later?', answer: 'Yes. Our LED Street Lights are designed with future-proofing in mind. They can be easily retrofitted with our IoT communication modules to become fully smart-managed lights whenever you are ready.' },
      { question: 'What is the warranty period?', answer: 'Our standard warranty for LED Street Lights is 5 years, covering manufacturing defects and performance degradation beyond normal parameters.' },
    ],
  },
];
