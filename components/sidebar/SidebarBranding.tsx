import React from 'react';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SidebarBranding({ className }: { className?: string }) {
  return (
    <div className={cn(
      'absolute bottom-4 left-0 w-6 text-center',
      className
    )}
      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}
    >
      <p style={{ fontSize: '1.1em' }} className="mb-6 tracking-wide text-sky-400">
        Powered by DataReef
      </p>
    </div>
  );
}