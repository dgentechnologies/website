import { Badge } from '@/components/ui/badge';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Legal</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white to-primary/80">
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-screen-lg px-4 md:px-6 prose prose-invert prose-lg mx-auto">
          <p>
            DGEN Technologies Pvt. Ltd. ("us", "we", or "our") operates the https://dgentechnologies.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <h2>1. Information Collection and Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <h3>Types of Data Collected</h3>
          <ul>
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, First name and last name, Phone number, Cookies and Usage Data.</li>
            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
          </ul>

          <h2>2. Use of Data</h2>
          <p>
            DGEN Technologies uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service when you choose to do so, to provide customer care and support, to provide analysis or valuable information so that we can improve the Service, to monitor the usage of the Service, and to detect, prevent and address technical issues.
          </p>

          <h2>3. Transfer of Data</h2>
          <p>
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.
          </p>

          <h2>4. Disclosure of Data</h2>
          <p>
            DGEN Technologies may disclose your Personal Data in the good faith belief that such action is necessary to: comply with a legal obligation, to protect and defend the rights or property of DGEN Technologies, to prevent or investigate possible wrongdoing in connection with the Service, to protect the personal safety of users of the Service or the public, and to protect against legal liability.
          </p>

          <h2>5. Security of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2>6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us by email: contact@dgentechnologies.com
          </p>
        </div>
      </section>
    </div>
  );
}
