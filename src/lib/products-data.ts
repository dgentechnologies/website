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
    category: 'Smart City Solutions',
    shortDescription: 'A scalable, industrial-grade smart city lighting system using Hybrid Wireless Mesh Network technology (ESP-MESH + 4G LTE) for cost-effective urban infrastructure modernization.',
    icon: Cpu,
    images: [
      { url: '/images/auralis-product-shot.png', alt: 'Auralis Pro Gateway Node smart street light controller mounted on urban pole - Dgen Technologies Made in India IoT device', hint: 'auralis device' },
      { url: 'https://picsum.photos/seed/smartlight2/1200/800', alt: 'Auralis Ecosystem cloud dashboard showing real-time smart street light monitoring and control panel', hint: 'iot dashboard' },
      { url: 'https://picsum.photos/seed/smartlight3/1200/800', alt: 'Auralis Hybrid Wireless Mesh Network topology map showing ESP-MESH clusters connected via 4G LTE gateway to cloud', hint: 'connected network' },
    ],
    longDescription: "The Auralis Ecosystem introduces a scalable, industrial-grade architecture for modernizing urban street lighting. Unlike traditional point-to-point systems that require expensive cellular hardware on every pole, Auralis utilizes a cost-effective Hybrid Wireless Mesh Network with ESP-MESH (Wi-Fi) for local clusters and 4G LTE for cloud connectivity. This ecosystem is composed of two distinct hardware variants: Auralis Core (Worker Node) and Auralis Pro (Gateway Node). By deploying these units in a 1:50 ratio (one Cluster Head per approximately 50 lights), municipalities can achieve 100% grid visibility and up to 80% energy savings while reducing SIM card costs by 98% compared to point-to-point systems. Proudly Made in India and designed for the Smart Cities Mission.",
    features: [],
    specifications: [],
    qna: [
      { question: 'How does the Auralis Ecosystem save money?', answer: '**The Auralis Ecosystem reduces operational costs by 98% on cellular subscriptions.** Our Hybrid-Mesh Topology uses ESP-MESH (Wi-Fi) for local cluster communication, requiring only one 4G LTE SIM card per 50 lights instead of one per light. Combined with intelligent dimming and predictive maintenance, cities typically achieve 80% energy savings.' },
      { question: 'What is the primary advantage of the Hybrid-Mesh Topology?', answer: '**The key advantage is massive cost reduction through our Cluster Head architecture.** By using one gateway (Auralis Pro) for every 50 lights (Auralis Core), you drastically reduce the number of expensive cellular subscriptions needed, lowering both initial hardware costs and ongoing operational expenses by up to 98%.' },
      { question: "How does the Auralis Ecosystem's predictive maintenance work?", answer: "**Our AI-powered platform proactively detects failures before they occur.** It analyzes real-time operational data from each Auralis device via MQTT/JSON packets. By identifying patterns that precede a failure, the system issues a maintenance alert, allowing teams to fix problems proactively before an outage occurs." },
      { question: "Is the Auralis Ecosystem compatible with existing city infrastructure?", answer: "**Yes, Auralis is designed for seamless retrofit integration.** Our smart street lights can replace existing fixtures with minimal modifications. The platform integrates with other city management systems via standard APIs, and the ESP-MESH network self-heals automatically if nodes are added or removed." }
    ],
    ecosystem: {
      architecture: {
        title: "System Architecture: The Cluster Model",
        description: "The system operates on a decentralized \"Cluster\" model using Hybrid Wireless Mesh Network technology. Up to 50 Core nodes form a self-healing ESP-MESH (Wi-Fi) local network, while a single Pro node acts as the 4G LTE gateway to the cloud, ensuring maximum resilience and minimal latency with MQTT/JSON packet communication.",
        comparison: [
            { key: 'Primary Role', value: 'Local Control & Relay vs. Data Aggregation & Backhaul' },
            { key: 'Deployment Ratio', value: '~50 per Cluster vs. 1 per Cluster (Cluster Head)' },
            { key: 'Connectivity', value: 'ESP-MESH (Wi-Fi Local) vs. ESP-MESH (Local) + 4G LTE Cat 1 (Cloud)' },
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
          description: "The ecosystem is designed for automated initialization, self-healing, and efficient data flow using MQTT/JSON packet communication.",
          details: [
              { icon: Network, title: "Initialization & Self-Healing", description: "The Auralis Pro (Gateway) establishes a 4G LTE cellular link and becomes the ESP-MESH Root. Core nodes automatically find the strongest signal path, forming a self-healing tree topology." },
              { icon: ToyBrick, title: "Data Flow & Aggregation", description: "Sensed data is encrypted as JSON packets and hopped across the ESP-MESH to the Pro Gateway, which buffers packets and performs a batch upload to the cloud via MQTT protocol, optimizing data usage." }
          ]
      }
    },
    subProducts: [
      {
        title: 'Auralis Core (Worker Node)',
        description: 'The standard, cost-effective smart lighting node for broad-scale urban deployment. Connects via ESP-MESH to the cluster gateway.',
        features: [
            { icon: Router, title: 'ESP-MESH Connectivity', description: 'Integrated Wi-Fi mesh for reliable local cluster communication.' },
            { icon: Radar, title: 'Radar-based Motion Detection', description: 'Accurate presence detection for adaptive lighting.' },
            { icon: GaugeCircle, title: 'Intelligent Dimming', description: 'Programmable dimming schedules to save energy.' },
        ],
        specifications: [
            { key: 'Input Voltage', value: '230V AC' },
            { key: 'Connectivity', value: 'ESP-MESH (Wi-Fi)' },
            { key: 'Motion Sensor', value: 'Doppler Radar' },
        ]
      },
      {
        title: 'Auralis Pro (Gateway Node)',
        description: 'The Cluster Head gateway with 4G LTE cloud connectivity. One Pro serves approximately 50 Core nodes, managing data aggregation and cloud uplink.',
        features: [
            { icon: Router, title: 'Hybrid Connectivity', description: 'ESP-MESH (Wi-Fi) for local mesh + 4G LTE Cat 1 for cloud backhaul via MQTT.' },
            { icon: Combine, title: 'Sensor Fusion (Radar + PIR)', description: 'Combines two sensor technologies for superior accuracy and elimination of false triggers.' },
            { icon: GaugeCircle, title: 'Intelligent Dimming', description: 'Programmable dimming schedules to save energy.' },
        ],
        specifications: [
            { key: 'Input Voltage', value: '230V AC' },
            { key: 'Connectivity', value: 'ESP-MESH (Wi-Fi) + 4G LTE Cat 1' },
            { key: 'Motion Sensor', value: 'Doppler Radar + PIR' },
        ]
      }
    ]
  },
  {
    slug: 'solar-street-light',
    title: 'Solar Street Light',
    category: 'Sustainable Lighting',
    shortDescription: 'Autonomous, off-grid lighting solutions powered by the sun, integrated with Auralis Smart City solutions.',
    icon: Sun,
    images: [
      { 
        url: '/images/solar-product-shot.png', 
        alt: 'Dgen Technologies Solar Street Light - Standalone off-grid sustainable lighting solution', 
        hint: 'Product View' 
      },
      { 
        url: '/images/solar-product-shot2.png', 
        alt: 'Solar street light illuminating urban park at night - High-efficiency LED output', 
        hint: 'Night Application' 
      },
      { 
        url: '/images/solar-product-process.png', 
        alt: 'Technical diagram illustrating the solar charging and auto-dimming process of Auralis Solar Lights', 
        hint: 'How It Works' 
      },
    ],
    longDescription: 'Our Solar Street Lights offer a sustainable and cost-effective solution for illuminating areas without access to the traditional power grid. Each unit is fully autonomous, with an integrated solar panel, high-capacity battery, and an efficient LED lamp. When combined with our Auralis Ecosystem platform (via our Hybrid Wireless Mesh Network), they become a powerful, remotely managed smart lighting grid with ESP-MESH connectivity for local clusters and 4G LTE gateway for cloud uplink. Proudly Made in India.',
    features: [
      { icon: Sun, title: 'Off-Grid Operation', description: 'Completely independent of the power grid, making it perfect for rural areas, highways, and remote locations across India.' },
      { icon: GaugeCircle, title: 'Intelligent Power Management', description: 'Smart controllers optimize charging and discharging cycles to ensure reliability even on cloudy days.' },
      { icon: Cpu, title: 'Remote Monitoring', description: 'When paired with the Auralis Ecosystem, you can monitor battery status, performance, and control lighting schedules remotely.' },
    ],
    specifications: [
      { key: 'Solar Panel', value: 'Monocrystalline, >22% efficiency' },
      { key: 'Battery', value: 'LiFePO4, >8 years lifespan' },
      { key: 'Luminosity', value: '3,000 - 12,000 lumens' },
      { key: 'Autonomy', value: '3-5 nights on a single full charge' },
      { key: 'Motion Sensor', value: 'Optional PIR motion sensor for adaptive dimming' },
    ],
    qna: [
      { question: 'How long does the battery last?', answer: '**Our LiFePO4 batteries provide 8+ years of reliable operation.** A single full charge can power the light for 3 to 5 continuous nights, ensuring reliability even during extended cloudy periods.' },
      { question: 'What kind of maintenance is required?', answer: '**Maintenance is minimal - just periodic solar panel cleaning.** We recommend cleaning the solar panel to ensure maximum efficiency. The smart system will report any other issues automatically if connected to the Auralis Ecosystem.' },
    ],
  },
  {
    slug: 'led-street-light',
    title: 'LED Street Light',
    category: 'High-Efficiency Lighting',
    shortDescription: 'Durable and energy-efficient LED street lights designed for longevity and superior illumination, upgradeable to smart capabilities.',
    icon: Lightbulb,
    images: [
        { 
          url: '/images/led-product-shot.png', 
          alt: 'Close-up view of Dgen Technologies high-efficiency LED street light fixture housing', 
          hint: 'Product Detail' 
        },
        { 
          url: '/images/led-product-shot2.png', 
          alt: 'Residential urban street illuminated by Dgen Technologies LED street lights with pedestrians', 
          hint: 'Street Application' 
        },
        { 
          url: '/images/led-product-shot3.png', 
          alt: 'Wide angle view of Dgen Technologies LED street lights illuminating a highway bridge at night', 
          hint: 'Highway View' 
        },
    ],
    longDescription: 'Our LED Street Lights are the perfect upgrade for cities looking to replace outdated and inefficient lighting systems. Engineered for durability, high performance, and maximum energy savings, these lights provide superior visibility and have a long operational lifespan. They serve as a foundational step towards a smarter city, with options to upgrade to full Auralis Ecosystem smart-light capabilities in the future. Made in India.',
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
      { question: 'Can these lights be upgraded to smart lights later?', answer: '**Yes, our LED Street Lights are designed to be future-proof.** They can be easily retrofitted with our Auralis Ecosystem IoT modules to become fully smart-managed lights with ESP-MESH connectivity whenever you are ready.' },
      { question: 'What is the warranty period?', answer: '**Our standard warranty is 5 years comprehensive coverage.** This covers manufacturing defects and performance degradation beyond normal parameters, backed by our Made in India quality assurance.' },
    ],
  },
];
