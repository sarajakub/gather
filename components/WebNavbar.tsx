'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Commitments", href: "/commitments" },
  { label: "Messages", href: "/messages" },
  { label: "Profile", href: "/profile" },
];

function isActive(pathname: string, href: string) {
  if (href === "/home") {
    return pathname === "/" || pathname === "/home";
  }

  return pathname.startsWith(href);
}

export default function WebNavbar() {
  const pathname = usePathname();

  return (
    <header className="web-navbar">
      <div className="web-navbar-inner">
        <Link href="/home" className="web-navbar-brand" aria-label="Go to Gather home">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark-dot brand-mark-dot-sage" />
            <span className="brand-mark-dot brand-mark-dot-peach" />
            <span className="brand-mark-dot brand-mark-dot-amber" />
          </div>
          <div>
            <p className="eyebrow">Community mutual aid</p>
            <strong className="brand-wordmark">Gather</strong>
          </div>
        </Link>

        <nav className="web-navbar-links" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-pill${isActive(pathname, item.href) ? " nav-pill-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="web-navbar-actions">
          <Link href="/post" className="btn btn-primary btn-md">
            Post a need
          </Link>
        </div>
      </div>
    </header>
  );
}
