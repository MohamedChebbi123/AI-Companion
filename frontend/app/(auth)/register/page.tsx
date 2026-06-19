import { RegisterForm } from '@/components/auth/RegisterForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-[#f0e6df] dark:bg-[#0A0A0F]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 38%, rgba(192,101,74,0.09) 0%, transparent 65%)',
        }}
      />
      <ThemeToggle />
      <RegisterForm />
    </main>
  );
}
