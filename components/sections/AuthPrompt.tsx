import Link from "next/link";

export default function AuthPrompt() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title justify-center text-center text-2xl">Sign in to continue</h2>
          <div className="space-y-3">
            <input className="input input-bordered w-full" type="email" placeholder="Email" aria-label="Email" />
            <input className="input input-bordered w-full" type="password" placeholder="Password" aria-label="Password" />
            <button className="btn btn-primary w-full">Login</button>
          </div>
          <div className="card-actions justify-center">
            <p className="text-sm text-base-content/70">
            Don&apos;t have an account?{" "}
              <Link href="/register" className="link link-primary">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
