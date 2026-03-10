"use client";

import Link from "next/link";
import { Truck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">LogiFlow Express</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              India's most reliable logistics partner. Delivering happiness to over 29,000+ pincodes with speed, safety, and trust.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/book" className="hover:text-primary transition-colors">
                  Express Parcel
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-primary transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/#coverage" className="hover:text-primary transition-colors">
                  Network Coverage
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LogiFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

