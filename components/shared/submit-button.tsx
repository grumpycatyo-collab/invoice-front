'use client';

import { useFormStatus } from 'react-dom';
import LoadingDots from '@/components/loading-dots'; 

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type={pending ? 'button' : 'submit'}
      aria-disabled={pending}
      className="font-sf flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-black hover:bg-gray-100 text-sm transition-all focus:outline-none px-4"
    >
      {pending ? (
        <LoadingDots color="#808080" />
      ) : (
        <p className="text-sm">{children}</p>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? 'Loading' : 'Submit form'}
      </span>
    </button>
  );
}