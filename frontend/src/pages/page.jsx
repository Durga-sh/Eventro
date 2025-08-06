import { HeroSection } from "../components/ui/hero";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import { FeaturesSection } from "../components/ui/features-section";


function StatsSection() {
  const stats = [
    { number: "10K+", label: "Events Created" },
    { number: "500K+", label: "Tickets Sold" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




export default function EventroLandingPage() {
  return (
    <>
      <main className="bg-black">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
      </main>
 
    </>
  );
}
