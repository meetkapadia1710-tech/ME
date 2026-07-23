"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type Slot = {
  time: string;
  status: "available" | "booked";
};

const INITIAL_SLOTS: Slot[] = [
  { time: "06:00 AM", status: "available" },
  { time: "07:00 AM", status: "booked" },
  { time: "08:00 AM", status: "available" },
  { time: "09:00 AM", status: "available" },
  { time: "10:00 AM", status: "booked" },
  { time: "11:00 AM", status: "available" },
  { time: "12:00 PM", status: "available" },
  { time: "01:00 PM", status: "available" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PlayHubDemo({ config }: { config?: any }) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const courts = config?.courts || ["Court 1", "Court 2"];
  const pricePerSlot = config?.pricePerSlot || 500;
  const [activeCourt, setActiveCourt] = useState(courts[0]);

  const toggleSlot = (time: string, status: string) => {
    if (status === "booked") return;
    const next = new Set(selectedSlots);
    if (next.has(time)) {
      next.delete(time);
    } else {
      next.add(time);
    }
    setSelectedSlots(next);
  };

  const handleCheckout = () => {
    if (selectedSlots.size === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const reset = () => {
    setSelectedSlots(new Set());
    setIsSuccess(false);
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      {/* Device frame container */}
      <div className="relative h-[700px] w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border-[8px] border-foreground/10 bg-background shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-foreground/10 backdrop-blur-md" />

        {/* Screen Content */}
        <div className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden pt-12 pb-24 scrollbar-hide">
          {isSuccess ? (
            <div className="flex h-full flex-col items-center justify-center space-y-6 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-foreground">Booking Confirmed!</h3>
                <p className="mt-2 text-sm text-foreground/60">
                  Your slots have been successfully booked. You&apos;ll receive a confirmation email shortly.
                </p>
              </div>
              <button
                onClick={reset}
                className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform active:scale-95"
              >
                Book Another
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-6 p-6">
              <header>
                <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">Book a Slot</h2>
                <p className="mt-1 text-sm text-foreground/60">Select slots for today</p>
              </header>

              {/* Court Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {courts.map((court: string) => (
                  <button
                    key={court}
                    onClick={() => setActiveCourt(court)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      activeCourt === court
                        ? "bg-foreground text-background"
                        : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
                    }`}
                  >
                    {court}
                  </button>
                ))}
              </div>

              {/* Slot Grid */}
              <div className="grid grid-cols-2 gap-3">
                {INITIAL_SLOTS.map((slot) => {
                  const isSelected = selectedSlots.has(slot.time);
                  const isBooked = slot.status === "booked";
                  
                  return (
                    <button
                      key={slot.time}
                      disabled={isBooked}
                      onClick={() => toggleSlot(slot.time, slot.status)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                        isBooked
                          ? "cursor-not-allowed border-foreground/5 bg-foreground/5 text-foreground/30"
                          : isSelected
                          ? "border-foreground bg-foreground text-background shadow-md"
                          : "border-foreground/10 bg-transparent text-foreground hover:border-foreground/30 active:scale-95"
                      }`}
                    >
                      <span className="font-mono text-sm">{slot.time}</span>
                      <span className="mt-1 text-[10px] uppercase tracking-wider opacity-70">
                        {isBooked ? "Booked" : `₹${pricePerSlot}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        {!isSuccess && (
          <div className="absolute bottom-0 left-0 w-full border-t border-foreground/10 bg-background/80 p-4 pt-4 pb-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-foreground/60 uppercase tracking-widest font-mono">Total</span>
                <span className="font-display text-xl font-medium">₹{selectedSlots.size * pricePerSlot}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={selectedSlots.size === 0 || isProcessing}
                className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    Checkout <span aria-hidden>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
