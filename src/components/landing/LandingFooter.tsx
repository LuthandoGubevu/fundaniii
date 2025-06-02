
import Link from "next/link";
// Placeholder for social icons if you add them later
// import { Facebook, Twitter, Instagram } from "lucide-react";

export default function LandingFooter() {
  const footerLinks = [
    { name: "About Fundees", href: "#" },
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  // const socialLinks = [
  //   { name: "Facebook", icon: Facebook, href: "#" },
  //   { name: "Twitter", icon: Twitter, href: "#" },
  //   { name: "Instagram", icon: Instagram, href: "#" },
  // ];

  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Fundees</h3>
            <p className="text-sm">
              Empowering young minds through creative storytelling and AI-assisted learning.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-yellow-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Stay Connected (Soon!)</h4>
            {/* <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div> */}
            <p className="text-sm text-gray-400">Follow us on social media for updates and fun content!</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Fundees — Let’s imagine together!
          </p>
        </div>
      </div>
    </footer>
  );
}
