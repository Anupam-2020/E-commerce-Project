import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <LoginForm />
    </div>
  );
}