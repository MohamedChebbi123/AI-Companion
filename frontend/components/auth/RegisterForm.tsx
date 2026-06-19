'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';

export function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    display_name: '',
    locale: 'en',
    status: 'active',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const field =
    (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Input
        placeholder="Display name"
        value={form.display_name}
        onChange={field('display_name')}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={field('email')}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={field('password')}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create account'}
      </Button>
      <p className="text-sm text-center text-zinc-500">
        Already have an account?{' '}
        <a href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
