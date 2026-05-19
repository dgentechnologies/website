import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Button,
  Link,
  Img,
  Hr,
} from 'react-email';

interface WelcomeEmailProps {
  userName?: string;
  userEmail?: string;
  companyName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dgentechnologies.com';
const primaryColor = '#19b35c';
const darkBg = '#1a1a1a';
const lightText = '#f3f4f6';
const mutedText = '#9ca3af';

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName = 'there',
  userEmail = '',
  companyName = 'Dgen Technologies',
}) => (
  <Html>
    <Head />
    <Preview>Welcome to Dgen Technologies - Innovate. Integrate. Inspire.</Preview>
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        {/* Header Section with Logo */}
        <Section style={headerSection}>
          <Row>
            <Column align="center" style={{ paddingBottom: '20px' }}>
              <Img
                src={`${baseUrl}/images/logo.png`}
                width="120"
                height="40"
                alt="Dgen Technologies Logo"
                style={{ display: 'block' }}
              />
            </Column>
          </Row>
          <Row>
            <Column align="center">
              <Text style={companyNameStyle}>{companyName}</Text>
            </Column>
          </Row>
          <Row>
            <Column align="center">
              <Text style={taglineStyle}>Innovate. Integrate. Inspire.</Text>
            </Column>
          </Row>
        </Section>

        <Hr style={dividerStyle} />

        {/* Welcome Message Section */}
        <Section style={contentSection}>
          <Row>
            <Column>
              <Text style={greetingStyle}>Welcome, {userName}! 👋</Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '24px' }}>
            <Column>
              <Text style={bodyTextStyle}>
                We're thrilled to have you join our community. Thank you for choosing Dgen Technologies as your partner in innovation.
              </Text>
            </Column>
          </Row>

          {/* About Company */}
          <Row style={{ marginTop: '32px' }}>
            <Column>
              <Text style={sectionHeadingStyle}>About Dgen Technologies</Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '12px' }}>
            <Column>
              <Text style={bodyTextStyle}>
                At Dgen Technologies, we're pioneering smart city solutions through cutting-edge IoT technology. Our flagship Auralis Ecosystem transforms urban infrastructure with intelligent street lighting, predictive maintenance, and real-time analytics.
              </Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '12px' }}>
            <Column>
              <Text style={bodyTextStyle}>
                We're also introducing ADAM (Autonomous Desktop AI Module) – a revolutionary AI-powered desktop application designed to redefine productivity and intelligent automation.
              </Text>
            </Column>
          </Row>

          {/* What You Can Explore */}
          <Row style={{ marginTop: '32px' }}>
            <Column>
              <Text style={sectionHeadingStyle}>What You Can Explore</Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '16px' }}>
            <Column style={{ paddingLeft: '20px' }}>
              <Text style={bulletPointStyle}>
                <span style={{ color: primaryColor, marginRight: '8px' }}>✓</span>
                <strong>Auralis Ecosystem</strong> – Advanced smart city lighting solutions
              </Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '8px' }}>
            <Column style={{ paddingLeft: '20px' }}>
              <Text style={bulletPointStyle}>
                <span style={{ color: primaryColor, marginRight: '8px' }}>✓</span>
                <strong>ADAM</strong> – Next-generation AI desktop module (coming soon)
              </Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '8px' }}>
            <Column style={{ paddingLeft: '20px' }}>
              <Text style={bulletPointStyle}>
                <span style={{ color: primaryColor, marginRight: '8px' }}>✓</span>
                <strong>Services</strong> – Custom IoT and smart infrastructure solutions
              </Text>
            </Column>
          </Row>

          {/* CTA Button */}
          <Row style={{ marginTop: '40px', marginBottom: '32px' }}>
            <Column align="center">
              <Button style={ctaButtonStyle} href={`${baseUrl}/products`}>
                Explore Our Products
              </Button>
            </Column>
          </Row>

          {/* Support Section */}
          <Section style={supportSection}>
            <Row>
              <Column>
                <Text style={supportHeadingStyle}>Need Help?</Text>
              </Column>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Column>
                <Text style={supportTextStyle}>
                  Have questions? Our team is here to help. Check out our{' '}
                  <Link href={`${baseUrl}/faq`} style={linkStyle}>
                    FAQ
                  </Link>
                  {' '}or{' '}
                  <Link href={`${baseUrl}/contact`} style={linkStyle}>
                    contact us
                  </Link>
                  .
                </Text>
              </Column>
            </Row>
          </Section>
        </Section>

        <Hr style={dividerStyle} />

        {/* Footer Section */}
        <Section style={footerSection}>
          <Row>
            <Column align="center">
              <Text style={footerHeadingStyle}>Dgen Technologies Pvt. Ltd.</Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '16px' }}>
            <Column align="center">
              <Text style={footerTextStyle}>
                Kolkata, India
                <br />
                <Link href="mailto:hello@dgentechnologies.com" style={linkStyle}>
                  hello@dgentechnologies.com
                </Link>
              </Text>
            </Column>
          </Row>

          {/* Social Links */}
          <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Column align="center">
              <Row>
                <Column style={{ paddingRight: '8px' }}>
                  <Link href="https://www.linkedin.com/company/dgen-technologies" style={socialLinkStyle}>
                    <Text style={socialTextStyle}>LinkedIn</Text>
                  </Link>
                </Column>
                <Column style={{ paddingRight: '8px', paddingLeft: '8px', borderLeft: `1px solid ${mutedText}`, borderLeftStyle: 'solid' }}>
                  <Link href="https://twitter.com/dgentechnologies" style={socialLinkStyle}>
                    <Text style={socialTextStyle}>Twitter</Text>
                  </Link>
                </Column>
                <Column style={{ paddingLeft: '8px' }}>
                  <Link href="https://www.instagram.com/dgentechnologies" style={socialLinkStyle}>
                    <Text style={socialTextStyle}>Instagram</Text>
                  </Link>
                </Column>
              </Row>
            </Column>
          </Row>

          {/* Copyright */}
          <Row>
            <Column align="center">
              <Hr style={smallDividerStyle} />
            </Column>
          </Row>

          <Row style={{ marginTop: '16px' }}>
            <Column align="center">
              <Text style={copyrightStyle}>
                © 2026 Dgen Technologies Pvt. Ltd. All rights reserved.
                <br />
                Made in India 🇮🇳
              </Text>
            </Column>
          </Row>

          <Row style={{ marginTop: '12px' }}>
            <Column align="center">
              <Text style={copyrightStyle}>
                <Link href={`${baseUrl}/privacy-policy`} style={linkStyle}>
                  Privacy Policy
                </Link>
                {' '} | {' '}
                <Link href={`${baseUrl}/terms-of-service`} style={linkStyle}>
                  Terms of Service
                </Link>
              </Text>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
);

/* Styles */
const bodyStyle: React.CSSProperties = {
  backgroundColor: darkBg,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  color: lightText,
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  width: '100%',
  margin: '0 auto',
  backgroundColor: darkBg,
};

const headerSection: React.CSSProperties = {
  padding: '40px 20px 20px',
  textAlign: 'center',
  borderBottom: `2px solid ${primaryColor}`,
};

const companyNameStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: primaryColor,
  margin: '12px 0 0 0',
  lineHeight: '1.2',
};

const taglineStyle: React.CSSProperties = {
  fontSize: '14px',
  color: mutedText,
  margin: '8px 0 0 0',
  letterSpacing: '1px',
  fontWeight: '500',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#333333',
  borderTop: `1px solid #333333`,
  margin: '0',
};

const smallDividerStyle: React.CSSProperties = {
  borderColor: '#333333',
  borderTop: `1px solid #333333`,
  margin: '12px 0',
};

const contentSection: React.CSSProperties = {
  padding: '40px 20px',
};

const greetingStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: lightText,
  margin: '0',
  lineHeight: '1.3',
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: '16px',
  color: mutedText,
  margin: '0 0 16px 0',
  lineHeight: '1.6',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '600',
  color: primaryColor,
  margin: '0',
  paddingBottom: '8px',
};

const bulletPointStyle: React.CSSProperties = {
  fontSize: '14px',
  color: mutedText,
  margin: '0 0 8px 0',
  lineHeight: '1.6',
};

const supportSection: React.CSSProperties = {
  backgroundColor: '#252525',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '32px',
  borderLeft: `4px solid ${primaryColor}`,
};

const supportHeadingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '600',
  color: primaryColor,
  margin: '0',
};

const supportTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: mutedText,
  margin: '0',
  lineHeight: '1.6',
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: primaryColor,
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `2px solid ${primaryColor}`,
};

const footerSection: React.CSSProperties = {
  padding: '40px 20px',
  textAlign: 'center',
  backgroundColor: '#0f0f0f',
};

const footerHeadingStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '600',
  color: primaryColor,
  margin: '0',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: mutedText,
  margin: '0',
  lineHeight: '1.6',
};

const linkStyle: React.CSSProperties = {
  color: primaryColor,
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.3s ease',
};

const socialLinkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: primaryColor,
  fontSize: '13px',
  fontWeight: '500',
};

const socialTextStyle: React.CSSProperties = {
  fontSize: '13px',
  color: primaryColor,
  margin: '0',
  textDecoration: 'none',
};

const copyrightStyle: React.CSSProperties = {
  fontSize: '12px',
  color: mutedText,
  margin: '0',
  lineHeight: '1.6',
};

export default WelcomeEmail;
