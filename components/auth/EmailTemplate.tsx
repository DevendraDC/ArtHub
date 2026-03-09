import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';


const EmailVerificationCode = (code: string) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Verify your email address with this code</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl shadow-sm max-w-150 mx-auto p-10">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-2">
                Verify Your Email
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Please use the verification code below to confirm your email address
              </Text>
            </Section>

            {/* Verification Code */}
            <Section className="text-center mb-8">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 inline-block">
                <Text className="text-[32px] font-bold text-gray-900 m-0 letter-spacing-[4px] font-mono">
                  {code}
                </Text>
              </div>
              <Text className="text-[14px] text-gray-500 mt-3 m-0">
                This code will expire in 10 minutes
              </Text>
            </Section>

            {/* Instructions */}
            <Section className="mb-8">
              <Text className="text-[16px] text-gray-700 m-0 mb-4">
                Thank you for signing up! To complete your account setup, please enter the verification code above in the verification field on our website.
              </Text>
              <Text className="text-[16px] text-gray-700 m-0">
                If you didn't request this verification, you can safely ignore this email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-6 mt-10">
              <Text className="text-[14px] text-gray-500 text-center m-0 mb-2">
                Best regards,<br />
                The Verification Team
              </Text>
              <Text className="text-[12px] text-gray-400 text-center m-0">
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 text-center m-0 mt-2">
                123 Business Street, Suite 100, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerificationCode.PreviewProps = {
  firstName: "John",
  verificationCode: "847291",
};

export default EmailVerificationCode;