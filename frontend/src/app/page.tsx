import Link from "next/link";

export default function Home() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <span className="logo">IG App</span>
          <div className="nav-links">
            <Link href="/login" className="btn btn-ghost">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="landing-hero">
        <div className="container">
          <h1>Modern SaaS Platform</h1>
          <p>
            Build, scale, and manage your operations with our high-performance SaaS template.
            Deploy instantly on Vercel and Render.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
