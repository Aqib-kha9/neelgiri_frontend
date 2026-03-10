import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { QuickTrackHero } from "@/components/landing/QuickTrackHero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContactForm } from "@/components/landing/ContactForm";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  ShieldCheck,
  Globe,
  Zap,
  Phone,
  ArrowRight,
  BarChart3,
  Users,
  Building2,
} from "lucide-react";

export const metadata = {
  title: "LogiFlow Express - Premium Logistics & Courier Services",
  description:
    "India's most trusted logistics partner. Express delivery, real-time tracking, and secure handling for all your shipments.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <PublicHeader />
      <main className="flex-1">

        <section className="relative overflow-hidden pt-12 pb-32 lg:pt-4 lg:pb-40 bg-background">
          {/* Subtle Grid Pattern (No Gradient) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-100 dark:opacity-20"></div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              {/* Left: Text Content */}
              <div className="text-center lg:text-left space-y-10 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Pan-India Coverage Live
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.1] text-foreground">
                  Logistics <br className="hidden lg:block" />
                  <span className="text-primary">Reimagined.</span>
                </h1>

                <p className="mx-auto lg:mx-0 max-w-xl text-lg text-muted-foreground leading-relaxed md:text-xl">
                  Experience the next generation of courier services. AI-optimized routes, millisecond-precise tracking, and premium handling for your valuable shipments.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link href="/book" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full h-14 px-8 rounded-full text-base font-bold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 bg-primary hover:bg-primary/90 text-white border-0">
                      Ship Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/quote" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full h-14 px-8 rounded-full text-base font-semibold border-2 border-border bg-background hover:bg-muted text-foreground transition-all">
                      Get Estimate
                    </Button>
                  </Link>
                </div>

                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground opacity-90">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">On-Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Live Tracking</span>
                  </div>
                </div>
              </div>

              {/* Right: Floating Card */}
              <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-md xl:max-w-lg perspective-1000 animate-in slide-in-from-right-8 duration-1000 delay-200 fade-in">

                <div className="relative bg-background border border-border p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-foreground/5">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Track Shipment</h3>
                      <p className="text-muted-foreground text-sm">Enter your AWB number to see real-time status.</p>
                    </div>

                    <QuickTrackHero />

                    <div className="pt-6 border-t border-border/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Delivered</p>
                          <p className="text-2xl font-bold text-foreground">1M+</p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pincodes</p>
                          <p className="text-2xl font-bold text-foreground">29k+</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Strip */}
        <section className="py-24 lg:py-32 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Why Choose LogiFlow?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">We don't just move boxes; we deliver promises. Our infrastructure is built for speed, reliability, and scale.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
              {[
                { icon: Zap, title: "Lighting Fast", desc: "Same-day and next-day delivery options for urgent shipments in metro cities." },
                { icon: Globe, title: "Hyper-Local Network", desc: "Dense network of delivery partners ensuring we reach you, wherever you are." },
                { icon: BarChart3, title: "Smart Analytics", desc: "Business insights and detailed reporting for our corporate partners." }
              ].map((feature, i) => (
                <div key={i} className="bg-card hover:bg-accent/5 transition-colors p-8 rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg group">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-32 relative overflow-hidden bg-slate-950">
          {/* Abstract Background Elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center text-white relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Ready to ship smarter?
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Join thousands of businesses and individuals across India who trust LogiFlow Express for their daily logistics.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link href="/book">
                <Button size="lg" className="h-14 px-10 rounded-full font-bold text-base bg-white text-slate-950 hover:bg-white/90 shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:-translate-y-0.5 border-0">
                  Book a Shipment
                </Button>
              </Link>
              <Link href="/quote">
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-full font-bold text-base bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
                  Check Rates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground text-lg mb-8">Have a question about your order or our services? We're here to help.</p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mt-1">
                      <Phone className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Call Us</h4>
                      <p className="text-muted-foreground">+91 1800-200-1234</p>
                      <span className="text-xs text-muted-foreground">Mon-Sat, 9am - 7pm</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mt-1">
                      <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Headquarters</h4>
                      <p className="text-muted-foreground">LogiFlow Towers, Cyber City,<br />Gurugram, Haryana - 122002</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-8 border shadow-lg">
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </div>
  );
}
