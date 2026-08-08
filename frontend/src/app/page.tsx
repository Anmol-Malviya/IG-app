import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="splash-page">
      {/* Floating decorative blobs */}
      <div className="splash-blob splash-blob-1" />
      <div className="splash-blob splash-blob-2" />
      <div className="splash-blob splash-blob-3" />

      {/* Floating geometric accents */}
      <div className="splash-gem splash-gem-1" />
      <div className="splash-gem splash-gem-2" />
      <div className="splash-gem splash-gem-3" />
      <div className="splash-gem splash-gem-4" />

      <div className="splash-inner">
        {/* Hero illustration */}
        <div className="splash-hero-wrap">
          <Image
            src="/auth-hero.png"
            alt="IG App dashboard illustration"
            width={300}
            height={300}
            priority
            className="splash-hero-img"
          />
        </div>

        {/* Branding */}
        <div className="splash-brand">
          <h1 className="splash-title">
            <span className="splash-title-dark">IG</span>
            <span className="splash-title-accent">App</span>
          </h1>
          <p className="splash-subtitle">
            Your All-in-One<br />
            Business Companion
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="splash-actions">
          <Link href="/login" className="splash-btn splash-btn-primary" id="btn-login">
            Login
          </Link>
          <Link href="/register" className="splash-btn splash-btn-outline" id="btn-signup">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
