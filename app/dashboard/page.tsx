"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Order } from "@/types";
import Navbar from "@/components/Navbar";
import { Loader2, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  paid: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  pending: {
    label: "Processing",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10 border-zinc-500/20",
  },
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/order?firebaseUid=${user.uid}`);
        if (res.ok) {
          const json = await res.json();
          setOrders((json.orders || []) as Order[]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
      setFetching(false);
    };

    fetchOrders();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          <p className="text-zinc-400 mt-1">
            Welcome back, {user.displayName?.split(" ")[0]}!
          </p>
        </div>

        {fetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <p className="text-zinc-400 mb-4">No bookings yet.</p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-colors"
            >
              Book Your First Party
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white">
                        {order.package_name}
                      </h3>
                      {order.party_date && (
                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.party_date).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </div>
                      )}
                      <p className="text-zinc-500 text-xs font-mono">
                        {order.id.slice(0, 16)}...
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-white">
                        ${order.amount}
                      </span>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${status.bg} ${status.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-500">
                    Booked on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {order.status === "failed" && (
                      <Link
                        href="/book"
                        className="ml-4 text-purple-400 hover:text-purple-300 underline"
                      >
                        Try again →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
