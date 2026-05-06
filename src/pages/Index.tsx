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
import FitAssessment from "@/components/FitAssessment";
import CampusTeam from "@/components/CampusTeam";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialCampus, setInitialCampus] = useState<string | undefined>(undefined);
  const openModal = () => {
    setInitialCampus(undefined);
    setModalOpen(true);
  };
  const openModalWithCampus = (campus: string) => {
    setInitialCampus(campus);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onRegisterClick={openModal} />
      <HeroSection onRegisterClick={openModal} />
      <ProgramOverview />
      <WhoThisIsFor />
      <AgendaSection />
      <CitiesSection onNotifyClick={openModalWithCampus} />
      <PricingSection onRegisterClick={openModal} />
        <CertificationSection />
        <PostCampusCommunity />
        <SocialProof />
      <BecomeHost />
      <FitAssessment onExpressInterest={openModal} />
      <CampusTeam />
      <FAQSection />
      <FinalCTA onRegisterClick={openModal} />
      <Footer />
      <RegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCampus={initialCampus}
      />
    </div>
  );
};

export default Index;
