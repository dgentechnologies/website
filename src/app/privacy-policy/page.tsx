import { Badge } from '@/components/ui/badge';

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = "November 7, 2025";
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Legal</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Last Updated: {lastUpdatedDate}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-lg px-4 md:px-6 prose prose-invert prose-lg mx-auto">
          <h2>1. Introduction</h2>
          <p>
            DGEN Technologies Pvt. Ltd. ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, https://dgentechnologies.com (the "Site"). Please read this policy carefully. By using the Site, you consent to the data practices described in this statement.
          </p>

          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </p>
          <h3>Personal Data</h3>
          <p>
            Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you fill out a contact form or otherwise interact with the Site.
          </p>
          <h3>Derivative Data</h3>
          <p>
            Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site. This is collected to ensure the security and optimal operation of our services.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
          </p>
          <ul>
            <li>Respond to your product and customer service requests.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you, with your consent.</li>
          </ul>

          <h2>4. Disclosure of Your Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to others. We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <h3>By Law or to Protect Rights</h3>
          <p>
            If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </p>
          <h3>Third-Party Service Providers</h3>
          <p>
            We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services, customer service, and marketing assistance.
          </p>

          <h2>5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2>6. Your Rights Regarding Your Information</h2>
          <p>
            You have certain rights regarding your personal information, including the right to access, correct, or delete the information we hold about you. If you wish to exercise these rights, please contact us using the contact information provided below.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at:
            <br/>
            DGEN Technologies Pvt. Ltd.
            <br/>
            Email: <a href="mailto:contact@dgentechnologies.com">contact@dgentechnologies.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
