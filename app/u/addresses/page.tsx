import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AddressesPage() {
  return <Card className="shadow"><form className="space-y-4"><CardContent className="space-y-4 p-6"><CardTitle className="text-2xl">Shipping addresses</CardTitle><Input placeholder="Full name" required /><Input placeholder="Address line" required /><div className="grid gap-4 sm:grid-cols-2"><Input placeholder="City" required /><Input placeholder="Postal code" required /></div><Button type="submit">Save address</Button></CardContent></form></Card>;
}
