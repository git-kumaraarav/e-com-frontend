import { cn } from "@/lib/utils";
const Deals = ({ className }: { className?: string }) => {
    const DealItems = [
        { id: 1, name: "Deal 1", description: "Description for Deal 1" },
        { id: 2, name: "Deal 2", description: "Description for Deal 2" },
        { id: 3, name: "Deal 3", description: "Description for Deal 3" },
        { id: 4, name: "Deal 4", description: "Description for Deal 4" },
        { id: 5, name: "Deal 5", description: "Description for Deal 5" },
        { id: 6, name: "Deal 6", description: "Description for Deal 6" }
    ]
  return <section className={cn("w-full", className)}>
    <div className="flex w-full flex-col gap-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
        <h2 className="font-heading text-2xl font-semibold">Exclusive Deals</h2>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DealItems.map((deal) => (
          <div key={deal.id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted">
            <h3 className="font-medium text-card-foreground">{deal.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{deal.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>;
};
export default Deals;
