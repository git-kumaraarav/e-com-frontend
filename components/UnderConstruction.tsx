import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent } from "@/components/ui/card";

type UnderConstructionProps = {
  title?: string;
  description?: string;
};

export default function UnderConstruction({
  title = "This page is under construction",
  description = "We are working on something useful here. Please check back soon.",
}: UnderConstructionProps) {
  return (
    <Card className="w-full max-w-2xl shadow-sm">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FontAwesomeIcon
            icon={faScrewdriverWrench}
            className="size-7"
            aria-hidden="true"
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-md leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
