"use client";

import { Calendar, CreditCard, QrCode, Users, Shield, Zap } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import { Card, CardContent } from "./card";
import { cn } from "../../lib/utils";

function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Event Creation & Management",
      description:
        "Create and manage events with ease. Set up venues, schedules, and capacity limits with our intuitive interface.",
    },
    {
      icon: CreditCard,
      title: "Razorpay Integration",
      description:
        "Secure payment processing with Razorpay. Accept multiple payment methods with industry-standard security.",
    },
    {
      icon: QrCode,
      title: "QR Code Generation",
      description:
        "Automatic QR code generation for tickets. Enable quick check-ins and seamless event entry management.",
    },
    {
      icon: Users,
      title: "Attendee Management",
      description:
        "Track registrations, manage attendee lists, and send automated confirmations and reminders.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with data encryption and reliable infrastructure for your peace of mind.",
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description:
        "Get insights into ticket sales, attendance patterns, and revenue with comprehensive analytics dashboard.",
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to manage events
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From creation to completion, EVENTRO provides all the tools you need
            to run successful events
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative">
              <div className="relative h-full rounded-xl border border-gray-700 p-1">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={80}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <Card className="relative h-full bg-gray-800 border-0 hover:bg-gray-750 transition-colors duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };

const GridItem = ({ area, icon, title, description }: any) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
