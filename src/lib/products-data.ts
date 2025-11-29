
import { Cpu, Sun, Lightbulb, LucideIcon, Wifi, Zap, ShieldCheck, GaugeCircle, Waves, Radar, Combine } from 'lucide-react';

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
    longDescription: 'Our flagship Auralis Smart Street Light is the cornerstone of modern urban infrastructure. It integrates advanced IoT technology to provide cities with centralized control, real-time monitoring, and intelligent automation. This product is designed to increase energy efficiency, reduce operational costs, and enhance public safety through reliable and adaptive lighting. The Auralis line is available in two connectivity models to suit different urban environments.',
    features: [], // Base features can be empty as specifics are in sub-products
    specifications: [], // Base specs can be empty
    qna: [
      { question: 'How much energy can be saved with these lights?', answer: 'Cities can typically achieve energy savings of 40-60% through intelligent dimming schedules and efficient LED technology.' },
      { question: 'What is the difference between the Auralis V1 and V2?', answer: 'The primary difference is the communication technology and sensor capabilities. The Auralis V1 (Wi-Fi) is ideal for dense urban areas, while the Auralis V2 (LoRaWAN) offers long-range communication and advanced sensor fusion for city-wide applications.' },
    ],
    subProducts: [
      {
        title: 'Auralis V1 (Wi-Fi)',
        description: 'Ideal for dense urban environments with existing Wi-Fi infrastructure. Offers high-bandwidth connectivity for complex control and data-rich applications.',
        features: [
          { icon: Wifi, title: 'Wi-Fi Connectivity', description: 'Leverages standard 2.4GHz Wi-Fi networks for easy integration and high data throughput.' },
          { icon: Radar, title: 'Radar-based Motion Detection', description: 'Provides reliable motion detection for adaptive lighting, unaffected by temperature or weather.'},
          { icon: GaugeCircle, title: 'Intelligent Dimming', description: 'Create custom dimming schedules to save energy during off-peak hours.' },
          { icon: Zap, title: 'Predictive Maintenance', description: 'AI-driven fault detection alerts you to potential issues before they cause an outage.' },
        ],
        specifications: [
            { key: 'Connectivity', value: 'Wi-Fi (802.11 b/g/n)' },
            { key: 'Luminosity', value: '4,000 - 15,000 lumens' },
            { key: 'IP Rating', value: 'IP66' },
            { key: 'Input Voltage', value: '90-305V AC' },
        ]
      },
      {
        title: 'Auralis V2 (LoRaWAN)',
        description: 'Designed for city-wide, low-power IoT networks. Provides long-range communication and advanced sensor capabilities.',
        features: [
            { icon: Waves, title: 'LoRaWAN Connectivity', description: 'Utilizes Long Range, Low Power Wide Area Network technology for city-scale coverage.' },
            { icon: Combine, title: 'Sensor Fusion (Radar + PIR)', description: 'Combines Radar and Passive Infrared (PIR) sensors for highly accurate presence detection and reduced false triggers.' },
            { icon: GaugeCircle, title: 'Remote Dimming Control', description: 'Adjust lighting levels across large areas from a central command center.' },
            { icon: Zap, title: 'Automated Fault Reporting', description: 'Each unit can report its status and any faults over the LoRaWAN network.' },
        ],
        specifications: [
            { key: 'Connectivity', value: 'LoRaWAN (865-867 MHz for India)' },
            { key: 'Luminosity', value: '4,000 - 15,000 lumens' },
            { key: 'IP Rating', value: 'IP66' },
            { key: 'Input Voltage', value: '90-305V AC' },
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
