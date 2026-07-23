"use client";

import { useState } from "react";
import { QrCode, Gift, Trophy, Star } from "lucide-react";

export default function AureDemo({ config }: { config?: any }) {
  const [points, setPoints] = useState(config?.points || 850);
  const [tier, setTier] = useState(config?.userTier || "Silver");
  const [isScanning, setIsScanning] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const NEXT_TIER_POINTS = 1000;
  const progress = Math.min((points / NEXT_TIER_POINTS) * 100, 100);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setPoints((prev: number) => {
        const newPoints = prev + 150;
        if (newPoints >= NEXT_TIER_POINTS && tier === "Silver") {
          setTier("Gold");
          setShowReward(true);
        }
        return newPoints;
      });
    }, 1500);
  };

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="relative h-[700px] w-full max-w-[340px] overflow-hidden rounded-[2.5rem] border-[8px] border-foreground/10 bg-background shadow-2xl">
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-foreground/10 backdrop-blur-md" />

        <div className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-muted/20 pb-10 pt-12 scrollbar-hide">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-6 pt-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Auré</h2>
            <div className="flex items-center gap-1 rounded-full bg-foreground/10 px-3 py-1">
              <Star className="h-4 w-4 fill-foreground/60 text-foreground/60" />
              <span className="font-mono text-sm font-medium">{points}</span>
            </div>
          </div>

          {/* Tier Status */}
          <div className="mx-6 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 p-6 text-background shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">Current Tier</p>
                <h3 className="font-display text-3xl font-medium tracking-tight">{tier}</h3>
              </div>
              <Trophy className={`h-10 w-10 ${tier === "Gold" ? "text-yellow-400" : "text-gray-300"}`} />
            </div>

            <div className="mt-8">
              <div className="flex justify-between font-mono text-xs opacity-70">
                <span>{points} pts</span>
                <span>{NEXT_TIER_POINTS} pts</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background/20">
                <div
                  className="h-full bg-background transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {tier === "Silver" ? (
                <p className="mt-3 font-mono text-xs opacity-70">
                  {NEXT_TIER_POINTS - points} more points to unlock Gold
                </p>
              ) : (
                <p className="mt-3 font-mono text-xs text-yellow-300">
                  You've unlocked Gold status!
                </p>
              )}
            </div>
          </div>

          {/* Scan Action */}
          <div className="mt-8 flex flex-col items-center justify-center px-6">
            <button
              onClick={handleScan}
              disabled={isScanning || tier === "Gold"}
              className={`group relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-300 ${
                isScanning
                  ? "scale-95 bg-foreground/20"
                  : tier === "Gold"
                  ? "bg-foreground/5 text-foreground/30 cursor-not-allowed"
                  : "bg-foreground text-background shadow-xl hover:scale-105 active:scale-95"
              }`}
            >
              {isScanning ? (
                <div className="absolute inset-0 rounded-full border-4 border-foreground/30 border-t-foreground animate-spin" />
              ) : (
                <QrCode className={`h-12 w-12 ${tier === "Gold" ? "opacity-30" : "transition-transform group-hover:scale-110"}`} />
              )}
            </button>
            <p className="mt-6 text-center text-sm font-medium text-foreground/70">
              {isScanning ? "Scanning receipt..." : tier === "Gold" ? "Max tier reached for demo" : "Scan to earn points"}
            </p>
          </div>

          {/* Reward Modal Simulation */}
          {showReward && (
            <div className="absolute inset-x-4 bottom-4 z-30 rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-500">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium">Reward Unlocked</h4>
                  <p className="text-sm text-foreground/60">Enjoy 20% off your next purchase!</p>
                </div>
              </div>
              <button
                onClick={() => setShowReward(false)}
                className="mt-4 w-full rounded-lg bg-foreground py-2 text-sm font-medium text-background"
              >
                Claim Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
