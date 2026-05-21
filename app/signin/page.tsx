import { AuthPage } from "@/components/AuthPage";

export const metadata = {
  title: "Vertex Markets - Sign In",
  description: "Sign in to your Vertex Markets account."
};

export default function SignInPage() {
  return <AuthPage mode="signin" />;
}
