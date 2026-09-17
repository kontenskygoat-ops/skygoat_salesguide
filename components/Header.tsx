import Link from "next/link";

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="shell navInner">
        <Link href="/" className="logoLink">
          <img src="/brand/skygoat-logo.png" alt="SKYGOAT" />
        </Link>

        <nav className="mainNav" aria-label="Main navigation">
          <Link href="/">Sales Guide</Link>
          <Link href="/media">Media & Mesin</Link>
        </nav>

        <Link href="/#start" className="navButton">
          Mulai Panduan
        </Link>
      </div>
    </header>
  );
}
