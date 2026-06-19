import { ButtonHTMLAttributes, InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50',
        'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
        className
      )}
      {...props}
    />
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30',
      'outline-none transition-colors',
      'focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
