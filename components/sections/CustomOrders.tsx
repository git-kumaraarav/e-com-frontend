import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faEnvelope,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CustomOrders() {
  return (
    <section className="overflow-hidden rounded-2xl border bg-muted/50">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
        <div className="max-w-2xl">
          <Badge>
            <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-1.5 size-3" aria-hidden="true" />
            Made for you
          </Badge>
          <h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
            Have something specific in mind?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Tell us what you need and our team will help create a custom order
            that is just right for you.
          </p>
        </div>
        <Link
          href="mailto:contact@acmeinnovates.com?subject=Custom%20order%20inquiry"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <FontAwesomeIcon icon={faEnvelope} className="size-4" aria-hidden="true" />
          Contact us
          <FontAwesomeIcon icon={faArrowRight} className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
