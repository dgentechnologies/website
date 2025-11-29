
import { Wifi, Zap, Sun, ShieldCheck, Cpu, GaugeCircle, LucideIcon } from 'lucide-react';

export type Product = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  icon: LucideIcon;
  images: { url: string; alt: string; hint: string }[];
  longDescription: string;
  features: {
    icon: LucideIcon;
    title: string;
    description: string;
  }[];
  specifications: { key: string; value: string }[];
  qna: { question: string; answer: string }[];
};

export const products: Product[] = [
  {
    slug: 'auralis-wifi',
    title: 'Auralis + Wifi',
    category: 'Smart Urban Connectivity',
    shortDescription: 'High-speed connectivity for dense urban environments, integrating public Wi-Fi with smart lighting.',
    icon: Wifi,
    images: [
      { url: 'https://picsum.photos/seed/wifi1/1200/800', alt: 'Auralis Wifi integrated into a city park', hint: 'city park' },
      { url: 'https://picsum.photos/seed/wifi2/1200/800', alt: 'Close-up of the Auralis Wifi antenna', hint: 'antenna closeup' },
      { url: 'https://picsum.photos/seed/wifi3/1200/800', alt: 'People using public wifi on a bench under an Auralis light', hint: 'public wifi' },
    ],
    longDescription: 'Auralis + Wifi is the ultimate solution for modern smart cities looking to provide seamless connectivity. By integrating high-speed Wi-Fi 6 capabilities directly into our smart street light infrastructure, we offer a dual-purpose platform that illuminates and connects communities. It is perfect for public parks, busy commercial streets, and transport hubs.',
    features: [
      { icon: Wifi, title: 'High-Speed Wi-Fi 6', description: 'Provides robust, high-capacity wireless coverage for public access and IoT devices.' },
      { icon: ShieldCheck, title: 'Secure Network', description: 'Features WPA3 encryption and network isolation to ensure data privacy and security for all users.' },
      { icon: Cpu, title: 'Centralized Management', description: 'Control lighting and Wi-Fi networks from a single, intuitive dashboard for streamlined operations.' },
    ],
    specifications: [
      { key: 'Wi-Fi Standard', value: '802.11ax (Wi-Fi 6)' },
      { key: 'Max Throughput', value: '1.2 Gbps' },
      { key: 'Concurrent Users', value: 'Up to 256 per unit' },
      { key: 'Security', value: 'WPA3, WPA2-Enterprise' },
      { key: 'Operating Temperature', value: '-40°C to 60°C' },
    ],
    qna: [
      { question: 'What is the typical range of one Auralis + Wifi unit?', answer: 'In a typical urban environment, one unit can provide reliable coverage up to a 100-meter radius, though this can vary based on obstructions.' },
      { question: 'Can the public Wi-Fi be separated from the city\'s operational network?', answer: 'Absolutely. The system is designed with network segmentation (VLANs) to create separate, secure networks for public access and municipal services.' },
    ],
  },
  {
    slug: 'auralis-lorawan',
    title: 'Auralis + LoRaWAN',
    category: 'Wide-Area IoT Network',
    shortDescription: 'Long-range, low-power connectivity perfect for city-wide sensor networks and large-scale monitoring.',
    icon: Zap,
    images: [
      { url: 'https://picsum.photos/seed/lora1/1200/800', alt: 'Auralis LoRaWAN gateway on a tall pole overlooking a city', hint: 'city overlook' },
      { url: 'https://picsum.photos/seed/lora2/1200/800', alt: 'Diagram showing LoRaWAN connecting various city sensors', hint: 'network diagram' },
      { url: 'https://picsum.photos/seed/lora3/1200/800', alt: 'A technician installing an Auralis LoRaWAN unit', hint: 'technician install' },
    ],
    longDescription: 'The Auralis + LoRaWAN gateway is engineered to create a powerful, city-wide IoT network. By leveraging the existing street light grid, it provides an ideal backbone for connecting thousands of low-power sensors over long distances. This is the perfect solution for applications like smart metering, waste management, environmental monitoring, and asset tracking.',
    features: [
      { icon: Zap, title: 'Long-Range Coverage', description: 'Communicate with devices up to 10-15 km away, providing comprehensive city-wide network coverage.' },
      { icon: GaugeCircle, title: 'Low Power Consumption', description: 'Ideal for battery-powered sensors, enabling long-term deployments without frequent maintenance.' },
      { icon: ShieldCheck, title: 'End-to-End Encryption', description: 'Utilizes AES-128 encryption at the network and application layers to secure all data transmissions.' },
    ],
    specifications: [
      { key: 'Frequency Bands', value: 'EU868, US915, IN865' },
      { key: 'Max Range', value: 'Up to 15 km (line of sight)' },
      { key: 'Channel Capacity', value: '8/16/64 channels available' },
      { key: 'Network Server', value: 'Built-in or external LNS compatible' },
      { key: 'IP Rating', value: 'IP67' },
    ],
    qna: [
      { question: 'How many sensors can one Auralis + LoRaWAN gateway support?', answer: 'A single gateway can support thousands of sensors, depending on the data transmission frequency and payload size of each sensor.' },
      { question: 'Is this compatible with The Things Network (TTN)?', answer: 'Yes, our LoRaWAN gateways can be configured to work with public networks like TTN or to operate as part of a private, city-owned network.' },
    ],
  },
  {
    slug: 'solar-street-lights',
    title: 'Solar Street Lights',
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
      { icon: Cpu, title: 'Remote Monitoring', description: 'When paired with Auralis, you can monitor battery status, performance, and control lighting schedules remotely.' },
    ],
    specifications: [
      { key: 'Solar Panel', value: 'Monocrystalline, >21% efficiency' },
      { key: 'Battery', value: 'LiFePO4, >5 years lifespan' },
      { key: 'Luminosity', value: '3,000 - 12,000 lumens' },
      { key: 'Autonomy', value: '3-5 nights on a single full charge' },
      { key: 'Motion Sensor', value: 'Optional PIR motion sensor for adaptive dimming' },
    ],
    qna: [
      { question: 'How long does the battery last?', answer: 'Our LiFePO4 batteries are designed for a lifespan of over 5 years. A single full charge can power the light for 3 to 5 continuous nights, ensuring reliability.' },
      { question: 'What kind of maintenance is required?', answer: 'Maintenance is minimal. We recommend periodic cleaning of the solar panel to ensure maximum efficiency. The system will report any other issues automatically.' },
    ],
  },
];
