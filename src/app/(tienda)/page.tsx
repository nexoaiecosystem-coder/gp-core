import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowToBuy } from "@/components/home/HowToBuy";
import { RubroSection } from "@/components/home/RubroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CustomPackagingCTA } from "@/components/home/CustomPackagingCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <CategoryGrid />
      <FeaturedProducts />
      <HowToBuy />
      <RubroSection />
      <CustomPackagingCTA />
    </>
  );
}
