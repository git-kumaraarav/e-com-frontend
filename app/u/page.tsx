 "use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function UserHomePage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  function logout() { localStorage.removeItem("commerce-token"); setUser(null); router.push("/"); }
  return (
    <section className="card bg-base-100 shadow-md">
      <div className="card-body">
      <p className="badge badge-primary badge-outline">Account</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold">Your account</h1>
      <p className="mt-3 text-base-content/70">{user ? `Signed in as ${user.email}` : "Sign in to manage your profile, orders, and preferences."}</p>
      {user ? <div className="card-actions mt-4"><button className="btn btn-error btn-outline" onClick={logout}>Sign out</button></div> : <button className="btn btn-primary mt-4 w-fit" onClick={() => router.push("/login")}>Sign in</button>}
      </div>
    </section>
  );
}