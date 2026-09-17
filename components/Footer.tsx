import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footerInner">
        <img src="/brand/skygoat-logo.png" alt="SKYGOAT" />
        <div>
          <p>Digital Sales Guide SKYGOAT</p>
          <span>Product knowledge · Sales flow · Media library</span>
        </div>
        <div className="footerLinks">
          <Link href="/">Sales Guide</Link>
          <Link href="/media">Media & Mesin</Link>
        </div>
      </div>
    </footer>
  );
}
