import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="shell navInner">
        <Link href="/" className="brandLogo" aria-label="SKYGOAT">
          <Image src="/brand/skygoat-logo.webp" alt="SKYGOAT" width={104} height={104} priority />
        </Link>

        <nav className="mainNav" aria-label="Navigasi utama">
          <Link href="/">Tentang SKYGOAT</Link>
          <Link href="/sales-guide">Sales Guide</Link>
          <Link href="/gallery">Galeri</Link>
        </nav>
      </div>
    </header>
  );
}
