import React from 'react';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SidebarBranding({ className }: { className?: string }) {
  return (
    <div className={cn(
      'absolute bottom-4 left-0 w-6 flex flex-col items-center justify-center tracking-wide text-sky-400',
      className
    )}
      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '1.1em' }}
    >
      Powered by DataReef
    </div>
  );
}