"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Order } from "@/types";
import { CheckCircle2, XCircle, Loader2, PartyPopper } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [polling, setPolling] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const MAX_POLL_ATTEMPTS = 20;
  const POLL_INTERVAL = 2000;

  const fetchOrder = useCallback(async () => {
    if (!orderId) return null;

    try {
      const res = await fetch(`/api/order?orderId=${orderId}`);
      if (!res.ok) {
        console.error("Error fetching order:", res.statusText);
        return null;
      }
      const json = await res.json();
      return json.order as Order;
    } catch (err) {
      console.error("Error fetching order:", err);
      return null;
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const poll = async () => {
      const data = await fetchOrder();
      setOrder(data);
      setAttempts((a) => a + 1);

      if (!data || data.status !== "pending") {
        setPolling(false);
        return;
      }

      if (attempts >= MAX_POLL_ATTEMPTS) {
        setPolling(false);
      }
    };

    poll();
    const interval = setInterval(async () => {
      const data = await fetchOrder();
      setOrder(data);
      setAttempts((a) => {
        const next = a + 1;
        if (!data || data.status !== "pending" || next >= MAX_POLL_ATTEMPTS) {
          setPolling(false);
          clearInterval(interval);
        }
        return next;
      });
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const renderContent = () => {
    if (polling || (order?.status === "pending" && attempts < MAX_POLL_ATTEMPTS)) {
      return (
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto" />
          <h1 className="text-3xl font-bold">Processing your payment...</h1>
          <p className="text-zinc-400">
            Please wait while we confirm your booking. This takes a few seconds.
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: Math.min(attempts, 10) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-purple-500" />
            ))}
          </div>
        </div>
      );
    }

    if (order?.status === "paid") {
      return (
        <div className="text-center space-y-6">
          <div className="relative">
            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto" />
            <PartyPopper className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2" />
          </div>
          <h1 className="text-4xl font-extrabold text-white">
            You&apos;re all set! 🎉
          </h1>
          <p className="text-zinc-300 text-lg max-w-md mx-auto">
            Your <span className="text-purple-400 font-semibold">{order.package_name}</span> has been booked.
            {order.party_date && (
              <> Party date: <span className="text-white font-semibold">{new Date(order.party_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></>
            )}
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3 max-w-sm mx-auto">
            <p className="text-sm text-zinc-400">Order Details</p>
            <div className="flex justify-between">
              <span className="text-zinc-300">Package</span>
              <span className="text-white font-medium">{order.package_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-300">Amount</span>
              <span className="text-white font-medium">${order.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-300">Status</span>
              <span className="text-green-400 font-medium">Confirmed ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-300">Order ID</span>
              <span className="text-zinc-400 text-xs font-mono">{order.id.slice(0, 8)}...</span>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-colors"
          >
            Back to Home
          </Link>
        </div>
      );
    }

    if (order?.status === "failed") {
      return (
        <div className="text-center space-y-6">
          <XCircle className="w-20 h-20 text-red-400 mx-auto" />
          <h1 className="text-3xl font-bold text-white">Payment Failed</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Your payment could not be processed. No charges were made.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/book" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-colors">
              Try Again
            </Link>
            <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center space-y-6">
        <Loader2 className="w-16 h-16 text-yellow-400 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Still processing...</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Your payment is taking longer than expected. Check your email for confirmation or contact support.
        </p>
        <Link href="/" className="inline-flex items-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
          Go Home
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-md shadow-2xl">
      {renderContent()}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <Navbar />
      <div className="max-w-2xl mx-auto">
        <Suspense
          fallback={
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-md shadow-2xl text-center">
              <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto" />
              <p className="text-zinc-400 mt-4">Loading...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
