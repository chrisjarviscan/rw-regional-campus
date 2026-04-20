import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProgramOverview from "@/components/ProgramOverview";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import AgendaSection from "@/components/AgendaSection";
import CitiesSection from "@/components/CitiesSection";
import PricingSection from "@/components/PricingSection";
import CertificationSection from "@/components/CertificationSection";
import PostCampusCommunity from "@/components/PostCampusCommunity";
import SocialProof from "@/components/SocialProof";
import BecomeHost from "@/components/BecomeHost";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen">
      <Navbar onRegisterClick={openModal} />
      <HeroSection onRegisterClick={openModal} />
      <ProgramOverview />
      <WhoThisIsFor />
      <AgendaSection />
      <CitiesSection />
      <PricingSection onRegisterClick={openModal} />
        <CertificationSection />
        <PostCampusCommunity />
        <SocialProof />
      <BecomeHost />
      <FAQSection />
      <FinalCTA onRegisterClick={openModal} />
      <Footer />
      <RegistrationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;
