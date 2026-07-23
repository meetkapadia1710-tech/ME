"use client";

import { useState } from "react";
import { Shield, ShieldAlert, ShieldCheck, MapPin, Users } from "lucide-react";

export default function LocateMeDemo() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sharing, setSharing] = useState(false);

  const handleGrant = () => {
    setStep(2);
    setTimeout(() => {
      setSharing(true);
      setStep(3);
    }, 1500);
  };

  const reset = () => {
    setSharing(false);
    setStep(1);
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      {/* Device frame container */}
      <div className="relative h-[700px] w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border-[8px] border-foreground/10 bg-background shadow-2xl">
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-foreground/10 backdrop-blur-md" />

        <div className="relative flex h-full w-full flex-col overflow-hidden bg-background pt-12">
          {/* Header */}
          <div className="flex flex-col items-center justify-center px-6 pb-6 pt-4 text-center">
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-500 ${sharing ? 'bg-green-500/10 text-green-500' : 'bg-foreground/5 text-foreground/80'}`}>
              {step === 2 ? <ShieldAlert className="h-8 w-8 animate-pulse" /> : 
               step === 3 ? <ShieldCheck className="h-8 w-8" /> : 
               <Shield className="h-8 w-8" />}
            </div>
            <h2 className="font-display text-2xl font-medium tracking-tight">Location Sharing</h2>
            <p className="mt-2 text-sm text-foreground/60">
              {step === 3 ? "Active and secured" : "Consent-first family tracking"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-24">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start gap-4">
                    <Users className="mt-1 h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Family Circle</h3>
                      <p className="mt-1 text-sm text-foreground/60">Your family group has requested to see your live location for safety.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/50">Privacy Controls</h4>
                  
                  <div className="flex items-center justify-between rounded-xl p-3 hover:bg-foreground/5">
                    <span className="text-sm font-medium">Exact Location</span>
                    <div className="h-6 w-11 rounded-full bg-blue-500 p-1 transition-colors">
                      <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-xl p-3 hover:bg-foreground/5">
                    <span className="text-sm font-medium">Auto-expire in 24h</span>
                    <div className="h-6 w-11 rounded-full bg-blue-500 p-1 transition-colors">
                      <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex h-full flex-col items-center justify-center animate-in fade-in duration-300">
                <MapPin className="h-12 w-12 animate-bounce text-blue-500" />
                <p className="mt-6 text-sm font-medium text-foreground/70">Establishing secure connection...</p>
                <div className="mt-4 h-1.5 w-32 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full w-1/2 animate-[ping_1.5s_ease-in-out_infinite] rounded-full bg-blue-500" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent p-6 text-center border border-green-500/20">
                  <h3 className="font-display text-xl font-medium text-green-500">Live Sharing Active</h3>
                  <p className="mt-2 text-sm text-foreground/60">Your family circle can now see your location. You are in control and can revoke access anytime.</p>
                  <p className="mt-4 font-mono text-xs text-foreground/40 uppercase tracking-widest">Expires in 23:59:59</p>
                </div>

                <button 
                  onClick={reset}
                  className="mt-8 w-full rounded-xl border border-red-500/30 bg-red-500/5 py-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  Revoke Access Immediately
                </button>
              </div>
            )}
          </div>

          {/* Bottom Sticky Action */}
          {step === 1 && (
            <div className="absolute bottom-0 left-0 w-full border-t border-border bg-background/80 p-4 pt-4 pb-8 backdrop-blur-xl">
              <button
                onClick={handleGrant}
                className="w-full rounded-full bg-foreground py-4 text-sm font-medium text-background transition-transform active:scale-95"
              >
                Grant Location Access
              </button>
              <p className="mt-3 text-center font-mono text-[10px] text-foreground/40 uppercase tracking-widest">
                Data is encrypted end-to-end
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
