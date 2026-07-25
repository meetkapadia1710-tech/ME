import { cn } from "@/lib/utils";

export function ProgressiveBlur({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 h-32 w-full select-none",
        className
      )}
    >
      <div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,black_10%,transparent_90%)]" />
      <div className="absolute inset-0 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_60%)]" />
      <div className="absolute inset-0 backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,black_70%,transparent_30%)]" />
    </div>
  );
}
