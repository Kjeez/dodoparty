"use client";

import Navbar from "@/components/Navbar";
import {
  Sparkles,
  Calendar,
  Users,
  Star,
  MapPin,
  Music,
  Camera,
  Utensils,
  Cake,
  Wine,
  PartyPopper,
  Heart,
  ChevronRight,
  Phone,
  Mail,
  ArrowRight,
  Check,
  Globe,
  Clock,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

const PACKAGES = [
  {
    id: "standard",
    name: "Standard Glow",
    price: 49.99,
    features: [
      "Up to 10 Guests",
      "2 Hours Room Rental",
      "Basic Decorations",
      "Soft Drinks",
      "Background Music",
    ],
    icon: <Users className="w-6 h-6" />,
    gradient: "from-sky-500 to-blue-600",
    shadow: "shadow-sky-500/25",
  },
  {
    id: "premium",
    name: "Premium Sparkle",
    price: 99.99,
    popular: true,
    features: [
      "Up to 20 Guests",
      "4 Hours Room Rental",
      "Premium Theme Setup",
      "Catering & Drinks",
      "Party Host",
      "Photo Booth",
    ],
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-purple-500 to-fuchsia-600",
    shadow: "shadow-purple-500/25",
  },
  {
    id: "vip",
    name: "VIP Extravaganza",
    price: 199.99,
    features: [
      "Unlimited Guests",
      "All-Day Access",
      "Custom Theme & Setup",
      "Gourmet Catering",
      "Live Entertainment",
      "Videography",
    ],
    icon: <Star className="w-6 h-6" />,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
  },
];

const SERVICES = [
  {
    icon: <Cake className="w-7 h-7" />,
    title: "Custom Cakes",
    description:
      "Bespoke designer cakes crafted to match your party theme and delight every guest.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    icon: <Music className="w-7 h-7" />,
    title: "Live DJs & Bands",
    description:
      "Professional entertainment to keep the energy high all night long.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: <Camera className="w-7 h-7" />,
    title: "Photography",
    description:
      "Capture every magical moment with our professional photographers.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: <Utensils className="w-7 h-7" />,
    title: "Gourmet Catering",
    description:
      "From finger foods to five-course meals — tailored to your taste.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: <Wine className="w-7 h-7" />,
    title: "Premium Bar",
    description:
      "Craft cocktails, fine wines, and artisanal beverages curated by experts.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    icon: <PartyPopper className="w-7 h-7" />,
    title: "Themed Décor",
    description:
      "Immersive decorations that transform any venue into your dream setting.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

const PARTY_TYPES = [
  {
    title: "Birthday Parties",
    description: "Make every year unforgettable with our themed celebrations.",
    image: "/images/party-kids.png",
  },
  {
    title: "Corporate Events",
    description: "Impress clients & reward teams with sophisticated gatherings.",
    image: "/images/party-corporate.png",
  },
  {
    title: "Wedding Receptions",
    description: "Celebrate love with elegance, grace, and pure joy.",
    image: "/images/party-wedding.png",
  },
];

const LOCATIONS = [
  {
    city: "Mumbai",
    venues: 12,
    flag: "🇮🇳",
  },
  {
    city: "New York",
    venues: 8,
    flag: "🇺🇸",
  },
  {
    city: "London",
    venues: 6,
    flag: "🇬🇧",
  },
  {
    city: "Dubai",
    venues: 9,
    flag: "🇦🇪",
  },
  {
    city: "Singapore",
    venues: 5,
    flag: "🇸🇬",
  },
  {
    city: "Sydney",
    venues: 4,
    flag: "🇦🇺",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Birthday Celebration",
    text: "DodoParty made my daughter's 10th birthday absolutely magical! The decorations were stunning and the team handled everything flawlessly.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "James Wilson",
    role: "Corporate Event",
    text: "We booked the VIP package for our annual gala. The attention to detail was incredible — our clients were thoroughly impressed.",
    rating: 5,
    avatar: "JW",
  },
  {
    name: "Aisha Khan",
    role: "Wedding Reception",
    text: "From the floral arrangements to the live band, every element was perfect. It was genuinely the best night of our lives.",
    rating: 5,
    avatar: "AK",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen pt-16 selection:bg-purple-500/30 overflow-hidden">
      <Navbar />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero-party.png"
            alt="Luxury party celebration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
        </motion.div>

        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[150px] animate-pulse pointer-events-none" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Trusted by 10,000+ happy hosts worldwide</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[0.9]">
              Book Your Next{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400">
                Unforgettable
              </span>{" "}
              Party
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              From intimate gatherings to extravagant galas — DodoParty
              transforms your vision into a celebration that leaves everyone
              speechless.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {!user ? (
                <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                  <div className="bg-zinc-950 px-8 py-3.5 rounded-full flex items-center gap-2">
                    <span className="text-zinc-300 font-medium">
                      Sign in to start booking
                    </span>
                  </div>
                </div>
              ) : (
                <Link
                  href="/book"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                >
                  <Calendar className="w-5 h-5" />
                  Book Your Party Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <a
                href="#gallery"
                className="inline-flex items-center gap-2 px-8 py-4 text-zinc-300 font-medium rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300"
              >
                Explore Events
                <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-zinc-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Available Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="relative border-y border-white/5 bg-zinc-900/50 backdrop-blur-sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Parties Hosted" },
              { value: "50+", label: "Premium Venues" },
              { value: "98%", label: "Happy Clients" },
              { value: "6", label: "Countries" },
            ].map((stat, i) => (
              <motion.div variants={itemVariants} key={i}>
                <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ SERVICES SECTION ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-3">
              What We Offer
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Everything You Need for the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                Perfect Party
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((service, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className={`group relative rounded-2xl ${service.bg} border ${service.border} p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center mb-5 ${service.color}`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PARTY TYPES GALLERY ═══════════════ */}
      <section id="gallery" className="py-24 md:py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-amber-400 uppercase mb-3">
              Our Specialties
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Every Occasion,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Perfected
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            {PARTY_TYPES.map((party, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] cursor-pointer"
              >
                <Image
                  src={party.image}
                  alt={party.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {party.title}
                  </h3>
                  <p className="text-zinc-300 text-sm mb-4">
                    {party.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-purple-400 font-medium text-sm group-hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ VENUE SHOWCASE ═══════════════ */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold tracking-widest text-emerald-400 uppercase mb-3">
                Premium Venues
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Stunning Spaces for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Every Vibe
                </span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Whether you dream of a rooftop soirée under the stars or an
                intimate indoor gathering with warm amber lighting — we have the
                perfect venue waiting for you.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Indoor ballrooms with crystal chandeliers",
                  "Rooftop terraces with panoramic city views",
                  "Lush garden estates with fairy light canopies",
                  "Beachside pavilions with ocean breezes",
                ].map((feature, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    key={idx}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-zinc-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full hover:bg-emerald-400 transition-colors"
              >
                View All Venues
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 relative"
            >
              <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />
              <div className="rounded-2xl overflow-hidden aspect-[3/4] relative z-10">
                <Image
                  src="/images/venue-indoor.png"
                  alt="Indoor venue"
                  width={400}
                  height={533}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-12 relative z-10">
                <Image
                  src="/images/venue-outdoor.png"
                  alt="Outdoor venue"
                  width={400}
                  height={533}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING SECTION ═══════════════ */}
      <section className="py-24 md:py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-purple-400 uppercase mb-3">
              Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Pick Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Perfect Package
              </span>
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Transparent pricing with no hidden fees. Every package includes
              our dedicated party coordinator.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {PACKAGES.map((pkg) => (
              <motion.div
                variants={itemVariants}
                key={pkg.id}
                className={`relative group rounded-3xl bg-zinc-900 border ${
                  pkg.popular
                    ? "border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "border-white/5"
                } p-8 transition-all duration-300 hover:-translate-y-2`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div
                  className={`w-12 h-12 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center mb-6 text-white`}
                >
                  {pkg.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-white">
                    ${pkg.price}
                  </span>
                  <span className="text-zinc-500 text-sm">/event</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-zinc-300 text-sm"
                    >
                      <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/book"
                  className={`block w-full text-center py-3 rounded-full font-semibold transition-all duration-300 ${
                    pkg.popular
                      ? `bg-gradient-to-r ${pkg.gradient} text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]`
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ LOCATIONS SECTION ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-sky-400 uppercase mb-3">
              Our Locations
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Party Anywhere in the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                World
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {LOCATIONS.map((loc, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className="group rounded-2xl bg-zinc-900/50 border border-white/5 p-6 text-center hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <div className="text-4xl mb-3">{loc.flag}</div>
                <h4 className="font-bold text-white mb-1">{loc.city}</h4>
                <div className="flex items-center justify-center gap-1 text-xs text-zinc-500">
                  <MapPin className="w-3 h-3" />
                  {loc.venues} venues
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS SECTION ═══════════════ */}
      <section className="py-24 md:py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold tracking-widest text-rose-400 uppercase mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Loved by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                Thousands
              </span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                variants={itemVariants}
                key={idx}
                className="rounded-2xl bg-zinc-900 border border-white/5 p-8 hover:border-white/10 transition-all hover:scale-[1.02]"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed mb-6 text-sm">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 shadow-2xl shadow-purple-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700" />
            <div className="absolute inset-0 bg-[url('/images/hero-party.png')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <Heart className="w-10 h-10 text-pink-300 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                Ready to Party?
              </h2>
              <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
                Let us handle the stress while you enjoy the celebration. Your
                dream party is just one click away.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]"
              >
                <Calendar className="w-5 h-5" />
                Start Planning Today
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                  <PartyPopper className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">DodoParty</span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The ultimate party booking platform. Making celebrations
                effortless since 2024.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-500">
                <li>
                  <Link
                    href="/book"
                    className="hover:text-white transition-colors"
                  >
                    Book a Party
                  </Link>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white transition-colors">
                    Our Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Venues
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-500">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">
                Get in Touch
              </h4>
              <ul className="space-y-2.5 text-sm text-zinc-500">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a
                    href="mailto:hello@dodoparty.com"
                    className="hover:text-white transition-colors"
                  >
                    hello@dodoparty.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href="#" className="hover:text-white transition-colors">
                    @dodoparty
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} DodoParty. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-zinc-600">
              <span>Powered by Dodo Payments</span>
              <span>Built with ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
