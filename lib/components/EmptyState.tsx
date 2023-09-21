import React from "react";

export function EmptyState({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full p-5 text-center">
      <span className="text-2xl text-stone-500">¯\_(ツ)_/¯</span>
      {children}
    </div>
  );
}
