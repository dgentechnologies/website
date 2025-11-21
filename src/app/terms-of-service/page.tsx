import { Badge } from '@/components/ui/badge';

export default function TermsOfServicePage() {
  const lastUpdatedDate = "November 7, 2025";
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container max-w-screen-xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Badge variant="outline" className="py-1 px-3 border-primary/50 text-primary">Legal</Badge>
            <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient">
              Terms of Service
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
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using our website, https://dgentechnologies.com (the "Site"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Site. The materials contained in this Site are protected by applicable copyright and trademark law.
          </p>

          <h2>2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws. The Content and the Marks are provided on the Site "AS IS" for your information and personal use only.
          </p>

          <h2>3. User Representations</h2>
          <p>
            By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Service; (2) you will not access the Site through automated or non-human means, whether through a bot, script, or otherwise; (3) you will not use the Site for any illegal or unauthorized purpose; and (4) your use of the Site will not violate any applicable law or regulation.
          </p>

          <h2>4. Prohibited Activities</h2>
          <p>
            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activity includes, but is not limited to: systematic retrieval of data, attempting to impersonate another user, or interfering with the Site's security features.
          </p>
          
          <h2>5. Disclaimer of Warranties</h2>
          <p>
            The Site and its Content are provided on an "as-is" and "as-available" basis. DGEN Technologies makes no warranties, expressed or implied, and hereby disclaims all other warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property. We do not warrant that the Site will be uninterrupted, secure, or error-free.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall DGEN Technologies or its directors, employees, or agents be liable for any direct, indirect, incidental, special, or consequential damages arising out of, or in any way connected with, the use of the Site or with the delay or inability to use the Site, or for any information, software, products, and services obtained through the Site.
          </p>

          <h2>7. Modifications and Interruptions</h2>
          <p>
            We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the Site without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Site.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms of Service and your use of the Site are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in West Bengal, India.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            To resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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
