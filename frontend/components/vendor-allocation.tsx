"use client";

import { useState } from "react";
import { MapPin, Phone, Star, Zap, Clock } from "lucide-react";

export default function VendorAllocationSection() {
  const [selectedState, setSelectedState] = useState("Rajasthan");
  const [selectedCity, setSelectedCity] = useState("Jaipur");

  const states = ["Rajasthan", "Gujarat", "Maharashtra", "Uttar Pradesh", "Delhi", "Karnataka", "Tamil Nadu"];
  const cities: Record<string, string[]> = {
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Aurangabad"],
    "Uttar Pradesh": ["Noida", "Lucknow", "Kanpur", "Agra"],
    Delhi: ["New Delhi", "Gurgaon", "Noida"],
    Karnataka: ["Bengaluru", "Mangalore", "Mysore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  };

  const mockVendors = [
    {
      id: 1,
      name: "SunGuard Solar Solutions",
      city: "Jaipur",
      rating: 4.9,
      reviews: 245,
      installs: "500+",
      experience: "12 years",
      specialty: "Residential & Commercial",
      responseTime: "2 hours",
      certification: "ALMM Verified",
      image: "🏢",
    },
    {
      id: 2,
      name: "RoofEnergy Installations",
      city: "Jaipur",
      rating: 4.8,
      reviews: 189,
      installs: "380+",
      experience: "8 years",
      specialty: "On-Grid Systems",
      responseTime: "4 hours",
      certification: "BIS Certified",
      image: "⚡",
    },
    {
      id: 3,
      name: "AuraPower India",
      city: "Jaipur",
      rating: 4.7,
      reviews: 156,
      installs: "290+",
      experience: "6 years",
      specialty: "Hybrid Solutions",
      responseTime: "6 hours",
      certification: "ALMM Verified",
      image: "☀️",
    },
  ];

  return (
    <section id="vendor-allocation" className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          Local Expertise
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          Find Verified Solar Installers Near You
        </h2>
        <p className="mt-4 mx-auto max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
          SAFWE partners with vetted, certified installers in your area. Quality service, fast turnaround, and accountability guaranteed.
        </p>
      </div>

      {/* Location Selector */}
      <div className="mb-12 rounded-2xl bg-linear-to-r from-slate-50 to-slate-100 border border-slate-200 p-8">
        <h3 className="font-semibold text-slate-900 mb-6">Find Vendors in Your Area</h3>
        
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          {/* State Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity(cities[e.target.value][0]);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-amber-400"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-amber-400"
            >
              {cities[selectedState]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 px-6 py-3 font-bold text-white transition">
          <MapPin className="inline mr-2 h-5 w-5" /> Find Vendors in {selectedCity}
        </button>
      </div>

      {/* Vendors Grid */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          Available Installers in {selectedCity}
        </h3>
        
        <div className="grid gap-6 md:grid-cols-3">
          {mockVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="bg-linear-to-r from-amber-500 to-orange-500 px-6 py-8 text-center">
                <div className="text-5xl mb-3">{vendor.image}</div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h4 className="font-bold text-slate-900 mb-2">{vendor.name}</h4>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(vendor.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {vendor.rating}
                  </span>
                  <span className="text-xs text-slate-600">
                    ({vendor.reviews} reviews)
                  </span>
                </div>

                {/* Info Grid */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Installations</p>
                      <p className="font-semibold text-slate-900">{vendor.installs}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Response Time</p>
                      <p className="font-semibold text-slate-900">{vendor.responseTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">⏱️</span>
                    <div>
                      <p className="text-xs text-slate-600">Experience</p>
                      <p className="font-semibold text-slate-900">{vendor.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {vendor.certification}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {vendor.specialty}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2">
                  <button className="w-full rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2 text-sm font-bold text-white transition">
                    Get Quote
                  </button>
                  <a
                    href={`tel:+919876543210`}
                    className="block w-full rounded-lg border border-slate-300 hover:bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 text-center transition"
                  >
                    <Phone className="inline mr-2 h-4 w-4" /> Contact
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Quality Promise */}
      <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-8 md:p-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Why SAFWE Vendors Are Different</h3>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "✓", title: "Vetted & Verified", desc: "Every vendor background checked & ALMM certified" },
            { icon: "💬", title: "Transparent Pricing", desc: "No hidden charges, clear cost breakdown in writing" },
            { icon: "🛡️", title: "Performance Bond", desc: "Vendor insured for quality, timeline, and warranty compliance" },
            { icon: "⭐", title: "Rating-Based", desc: "Only high-rated vendors survive on SAFWE. 4.5+ stars minimum." },
            { icon: "📅", title: "SLA Commitment", desc: "Response in 24 hrs, quote in 48 hrs, install within 2 weeks" },
            { icon: "🔧", title: "Workmanship Guarantee", desc: "5-10 year workmanship warranty on all installations" },
            { icon: "📸", title: "Photo Documentation", desc: "Before/after photos, drone surveys, video handover" },
            { icon: "📞", title: "Direct Support", desc: "Your vendor is your point of contact. Direct escalation to us." },
          ].map((item, i) => (
            <div key={i} className="rounded-xl bg-white p-6 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-slate-900 mb-2 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-slate-700 mb-4">Not sure which vendor to choose?</p>
        <a
          href="/calculator"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-600 px-8 py-3 font-bold text-white transition"
        >
          Start Your Free Consultation
          <span>→</span>
        </a>
      </div>
    </section>
  );
}
