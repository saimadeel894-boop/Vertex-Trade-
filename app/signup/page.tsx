import { AuthBackground } from "@/components/AuthBackground";
import { AuthPage } from "@/components/AuthPage";

export const metadata = {
  title: "Vertex Markets - Sign Up",
  description: "Create your Vertex Markets account."
};

export default function SignUpPage() {
  return <AuthPage mode="signup" background={<AuthBackground />} />;
}
