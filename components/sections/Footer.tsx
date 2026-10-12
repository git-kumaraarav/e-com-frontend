import { cn } from "@/lib/utils";
import React from "react";
const Footer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return <div className={cn("w-full flex", className)}>
    {/* Company Story */}
    <div className="flex flex-col gap-2 w-full">
      <h2 className="text-lg font-semibold">Our Story</h2>
      <p className="text-sm text-gray-600">
        We are a company dedicated to providing the best products and services to our customers. Our mission is to make your shopping experience enjoyable and hassle-free.
      </p>
    </div>

    {/* Contact Information */}
    <div className="flex flex-col gap-2 w-full mt-4">
      <h2 className="text-lg font-semibold">Contact Us</h2>
      <p className="text-sm text-gray-600">Email: work.kumaraarav@gmail.com</p>
      <p className="text-sm text-gray-600">Phone: +1 (123) 456-7890</p>
      <p className="text-sm text-gray-600">Address: 123 Main St, Anytown, USA</p>
    </div>

    {/* Social Media Links */}
    <div className="flex flex-col gap-2 w-full mt-4">
      <h2 className="text-lg font-semibold">Follow Us</h2>
      <div className="flex gap-4">
        <a href="#" className="text-blue-500 hover:underline">Facebook</a>
        <a href="#" className="text-blue-400 hover:underline">Twitter</a>
        <a href="#" className="text-pink-500 hover:underline">Instagram</a>
      </div>
    </div>

    {/* Newsletter Subscription */}
    <div className="flex flex-col gap-2 w-full mt-4">
      <h2 className="text-lg font-semibold">Subscribe to Our Newsletter</h2>
      <form className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-md p-2 flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
        >
          Subscribe
        </button>
      </form>
    </div>
  </div>;
};
export default Footer;
