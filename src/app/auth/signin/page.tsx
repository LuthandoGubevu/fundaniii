
import SignInForm from "@/components/auth/SignInForm";

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <SignInForm />
    </div>
  );
}
