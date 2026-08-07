import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}
