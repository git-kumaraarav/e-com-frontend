import { cn } from "@/lib/utils";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "footer mt-12 grid w-full gap-8 border-t border-base-300 py-10 md:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Our Story</h2>
        <p className="text-sm leading-6 text-base-content/70">
          We are dedicated to providing quality products and a simple shopping experience.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Contact Us</h2>
        <p className="text-sm text-base-content/70">work.kumaraarav@gmail.com</p>
        <p className="text-sm text-base-content/70">+1 (123) 456-7890</p>
        <p className="text-sm text-base-content/70">123 Main St, Anytown, USA</p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Follow Us</h2>
        <div className="flex gap-4">
          {["Facebook", "Twitter", "Instagram"].map((network) => (
            <a
              key={network}
              href={`https://www.${network.toLowerCase()}.com`}
              className="link link-hover text-sm text-base-content/70"
            >
              {network}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Newsletter</h2>
        <form className="join flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Your email"
            aria-label="Email address"
            className="input input-bordered join-item min-w-0 flex-1"
          />
          <button
            type="submit"
            className="btn btn-primary join-item"
          >
            Subscribe
          </button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
