import { cn } from "@/lib/utils";
import React from "react";
const Deals = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
    const DealItems = [
        { id: 1, name: "Deal 1", description: "Description for Deal 1" },
        { id: 2, name: "Deal 2", description: "Description for Deal 2" },
        { id: 3, name: "Deal 3", description: "Description for Deal 3" },
        { id: 4, name: "Deal 4", description: "Description for Deal 4" },
        { id: 5, name: "Deal 5", description: "Description for Deal 5" },
        { id: 6, name: "Deal 6", description: "Description for Deal 6" }
    ]
  return <div className={cn("w-full", className)}>
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-lg font-semibold">Exclusive Deals</h2>
      <div className="flex gap-2 justify-between w-full">
        {DealItems.map((deal) => (
          <div key={deal.id} className="bg-gray-200 rounded-md p-4">
            <h3 className="text-md font-medium">{deal.name}</h3>
            <p className="text-sm text-gray-600">{deal.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>;
};
export default Deals;
