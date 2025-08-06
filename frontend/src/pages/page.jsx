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

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Manager, TechCorp",
      content:
        "EVENTRO transformed how we manage our corporate events. The QR code system made check-ins seamless and the analytics helped us improve our events.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Conference Organizer",
      content:
        "The payment integration with Razorpay is flawless. Our attendees love the smooth booking experience and we've seen a 40% increase in registrations.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Workshop Coordinator",
      content:
        "From small workshops to large conferences, EVENTRO scales perfectly. The attendee management features save us hours of manual work.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by event organizers worldwide
          </h2>
          <p className="text-xl text-gray-400">
            See what our customers have to say about EVENTRO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const navigate = useNavigate();

  const handleBookEvent = () => {
    navigate("/events");
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Ready to transform your events?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of event organizers who trust EVENTRO to manage their
          events seamlessly
        </p>
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={handleBookEvent}
          >
            Book Event
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
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
        <CTASection />
      </main>
 
    </>
  );
}
