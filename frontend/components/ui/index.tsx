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
      'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm',
      'outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200',
      'dark:border-zinc-700 dark:bg-zinc-900 dark:text-white',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';
