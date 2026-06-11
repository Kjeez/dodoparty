"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Loader2, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

const PACKAGES = [
  { id: "standard", name: "Standard Glow", price: 49.99 },
  { id: "premium", name: "Premium Sparkle", price: 99.99 },
  { id: "vip", name: "VIP Extravaganza", price: 199.99 },
];

export default function BookPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1].id);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!selectedDate) {
      alert("Please select a date for your party.");
      return;
    }

    setIsProcessing(true);
    const pkg = PACKAGES.find((p) => p.id === selectedPackage);
    
    if (!pkg) return;

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: pkg.id,
          price: pkg.price,
          name: pkg.name,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error(error);
      alert("There was an error processing your request. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 selection:bg-purple-500/30">
      <Navbar />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">Book Your Party</h1>
          <p className="text-zinc-400 mb-8">Select a date and package to proceed with your booking.</p>
          
          <div className="space-y-8">
            {/* Date Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">
                Party Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            {/* Package Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-zinc-300">
                Select Package
              </label>
              <div className="grid sm:grid-cols-3 gap-4">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${
                      selectedPackage === pkg.id
                        ? "bg-purple-500/20 border-purple-500"
                        : "bg-black/30 border-white/10 hover:bg-black/50 hover:border-white/20"
                    }`}
                  >
                    {selectedPackage === pkg.id && (
                      <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-purple-400" />
                    )}
                    <h3 className="font-semibold text-white">{pkg.name}</h3>
                    <p className="text-xl font-bold text-purple-400 mt-2">${pkg.price}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
