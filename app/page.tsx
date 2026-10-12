import Image from "next/image";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import { cn } from "@/lib/utils";
import Deals from "@/components/sections/Deals";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="@container w-[95%] mx-auto flex min-h-screen flex-col items-center relative">
      <Navbar></Navbar> 
      <Hero /> 
      <Deals /> 
      <Footer /> 
    </main> 
  );
}
