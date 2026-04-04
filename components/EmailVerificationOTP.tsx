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

type props = {
  userEmail: string;
  otpCode: string;
}

const EmailVerificationOtp = (props : props) => {
  const { otpCode, userEmail} = props;

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Verify your email address with code: {otpCode}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-blue-900 m-0 mb-[8px]">
                Verify Your Email Address
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                Complete your account setup
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 mb-[24px] m-0">
                Hi,
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] m-0">
                Thank you for creating your account! To complete your registration and verify your email address <strong>{userEmail}</strong>, please use the verification code below:
              </Text>

              {/* OTP Code Display */}
              <Section className="text-center bg-blue-50 border-2 border-blue-200 rounded-[12px] p-[32px] mb-[24px]">
                <Text className="text-[14px] text-blue-600 mb-[12px] m-0 uppercase tracking-wide font-semibold">
                  Email Verification Code
                </Text>
                <Text className="text-[42px] font-bold text-blue-900 m-0 tracking-[6px] font-mono bg-white rounded-[8px] py-[16px] px-[24px] border border-blue-300">
                  {otpCode}
                </Text>
                <Text className="text-[14px] text-blue-600 mt-[12px] m-0">
                  Enter this code to verify your email
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-700 mb-[24px] m-0">
                This verification code will expire in <strong>10 minutes</strong>. Once verified, you'll have full access to your account and all our features.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                If you didn't create an account with us, please ignore this email. Your email address will not be added to our system.
              </Text>
            </Section>

            {/* Benefits Section */}
            <Section className="bg-green-50 border border-green-200 rounded-[8px] p-[24px] mb-[32px]">
              <Text className="text-[16px] text-green-800 m-0 mb-[12px] font-semibold">
                ✅ What happens after verification:
              </Text>
              <Text className="text-[14px] text-green-700 m-0 mb-[8px]">
                • Full access to your account dashboard
              </Text>
              <Text className="text-[14px] text-green-700 m-0 mb-[8px]">
                • Ability to receive important account notifications
              </Text>
              <Text className="text-[14px] text-green-700 m-0">
                • Enhanced security for your account
              </Text>
            </Section>

            {/* Help Section */}
            <Section className="bg-gray-50 rounded-[8px] p-[20px] mb-[32px]">
              <Text className="text-[14px] text-gray-700 m-0 mb-[12px] font-semibold">
                Need help?
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                If you're having trouble with email verification or didn't receive this code, please contact our support team. We're here to help!
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[14px] text-gray-500 m-0 mb-[16px]">
                Welcome to our platform!<br />
                The Team
              </Text>
              
              <Text className="text-[12px] text-gray-400 m-0 mb-[8px]">
                This email was sent to {userEmail} because you started the account registration process.
              </Text>
              
              {/* Company Footer */}
              <Text className="text-[12px] text-gray-400 m-0 mb-[4px]">
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-400 m-0">
                123 Business Street, Suite 100, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

EmailVerificationOtp.PreviewProps = {
  otpCode: "583947",
  userEmail: "silverisag54@gmail.com",
  userName: "John",
  expiryMinutes: "15",
};

export default EmailVerificationOtp;