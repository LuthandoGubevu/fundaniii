
import SignUpForm from "@/components/auth/SignUpForm";

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <SignUpForm />
    </div>
  );
}
