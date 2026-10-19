import { cn } from "@/lib/utils";

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "mt-12 grid w-full gap-8 border-t border-border py-10 md:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Our Story</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          We are dedicated to providing quality products and a simple shopping experience.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Contact Us</h2>
        <p className="text-sm text-muted-foreground">work.kumaraarav@gmail.com</p>
        <p className="text-sm text-muted-foreground">+1 (123) 456-7890</p>
        <p className="text-sm text-muted-foreground">123 Main St, Anytown, USA</p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Follow Us</h2>
        <div className="flex gap-4">
          {["Facebook", "Twitter", "Instagram"].map((network) => (
            <a
              key={network}
              href={`https://www.${network.toLowerCase()}.com`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {network}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Newsletter</h2>
        <form className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Your email"
            aria-label="Email address"
            className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Subscribe
          </button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
