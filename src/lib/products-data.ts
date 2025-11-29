
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
};

export const products: Product[] = [
  {
    slug: 'auralis-smart-street-light',
    title: 'Auralis Smart Street Light',
    category: 'Intelligent Urban Lighting',
    shortDescription: 'Advanced IoT-enabled street light with remote management, dimming schedules, and fault detection.',
    icon: Cpu,
    images: [
      { url: 'https://picsum.photos/seed/smartlight1/1200/800', alt: 'A modern smart street light in a city at dusk', hint: 'smart light' },
      { url: 'https://picsum.photos/seed/smartlight2/1200/800', alt: 'Dashboard showing control panel for smart street lights', hint: 'iot dashboard' },
      { url: 'https://picsum.photos/seed/smartlight3/1200/800', alt: 'Network of connected smart street lights on a map', hint: 'connected network' },
    ],
    longDescription: "The Auralis Ecosystem introduces a scalable, industrial-grade architecture for modernizing urban street lighting. Unlike traditional systems that require expensive cellular hardware on every pole, Auralis utilizes a cost-effective Hybrid-Mesh Topology. By deploying Auralis Core and Pro nodes in a 1:50 ratio, municipalities can achieve 100% grid visibility and up to 80% energy savings while significantly reducing hardware and cellular data costs.",
    features: [], // Base features can be empty as specifics are in sub-products
    specifications: [
        // Comparative specifications now live here to be used in the new table
        { key: 'Primary Role', value: 'Local Control & Relay vs. Data Aggregation & Backhaul' },
        { key: 'Deployment Ratio', value: '~50 per Cluster vs. 1 per Cluster' },
        { key: 'Connectivity', value: 'Mesh Protocol (Local) vs. Mesh (Local) + 4G LTE' },
        { key: 'Power Consumption', value: '< 1.5W (Standby) vs. ~2.5W (Average)' },
        { key: 'Power Supply', value: '3W Isolated AC-DC vs. 10W Reinforced PSU' },
        { key: 'Antenna', value: 'Single External Omni vs. Dual Combo Puck (LTE + Wi-Fi)' },
        { key: 'Controller', value: 'Industrial Dual-Core MCU vs. Industrial Dual-Core MCU' },
    ],
    qna: [
      { question: 'How much energy can be saved with this ecosystem?', answer: 'Cities can typically achieve energy savings of up to 80% through intelligent dimming, real-time monitoring, and optimized grid performance.' },
      { question: 'What is the primary advantage of the Hybrid-Mesh Topology?', answer: 'The key advantage is cost reduction. By using one gateway (Auralis Pro) for every 50 lights (Auralis Core), you drastically reduce the number of expensive cellular subscriptions needed, lowering both initial hardware costs and ongoing operational expenses.' },
    ],
    subProducts: [
      {
        title: 'Auralis Core (Worker Node)',
        description: 'A low-cost, mass-deployment unit that controls individual lights and acts as a data relay within the local mesh network.',
        features: [
          { icon: Network, title: 'Mesh Protocol Connectivity', description: 'Communicates locally with other Core nodes and the Pro gateway over a proprietary 2.4 GHz mesh network.' },
          { icon: GaugeCircle, title: 'Intelligent Dimming Engine', description: 'Precise, flicker-free AC phase-cutting for 0-100% brightness control.' },
          { icon: Radar, title: 'Microwave Doppler Radar', description: 'Integrated motion detection that works through the enclosure, maintaining IP67 integrity.' },
          { icon: Zap, title: 'Real-time Fault Monitoring', description: 'A Hall-Effect sensor detects open or short circuits for instant maintenance alerts.' },
        ],
        specifications: [
            { key: 'Primary Role', value: 'Local Control & Relay' },
            { key: 'Connectivity', value: 'Mesh Protocol (Local)' },
            { key: 'Power Supply', value: '3W Isolated AC-DC' },
            { key: 'Power Consumption', value: '< 1.5W (Standby)' },
            { key: 'Antenna', value: 'Single External Omni' },
            { key: 'Controller', value: 'Industrial Dual-Core MCU' },
        ]
      },
      {
        title: 'Auralis Pro (Gateway Node)',
        description: 'A high-performance cluster head that aggregates data from up to 50 Core nodes and bridges the network to the cloud via 4G LTE.',
        features: [
          { icon: Router, title: '4G LTE Cat 1 Backhaul', description: 'Provides reliable, low-latency cloud connectivity for the entire cluster.' },
          { icon: ToyBrick, title: 'Data Aggregation', description: 'Acts as the "Root" of the mesh, collecting encrypted telemetry from all worker nodes for a secure batch upload.' },
          { icon: ShieldCheck, title: 'Reinforced Power Architecture', description: 'A specialized 10W power supply handles the high-current demands of cellular transmission without resets.' },
          { icon: Zap, title: 'Advanced Signal Integrity', description: 'Specialized PCB design ensures cellular transmissions do not interfere with the local mesh network or sensor logic.' },
        ],
        specifications: [
            { key: 'Primary Role', value: 'Data Aggregation & Backhaul' },
            { key: 'Connectivity', value: 'Mesh (Local) + 4G LTE Cat 1 (Cloud)' },
            { key: 'Power Supply', value: '10W Reinforced High-Current PSU' },
            { key: 'Power Consumption', value: '~2.5W (Average), 10W Peak' },
            { key: 'Antenna', value: 'Dual Combo Puck (LTE + Wi-Fi)'},
            { key: 'Controller', value: 'Industrial Dual-Core MCU' },
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
