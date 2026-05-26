import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProgramOverview from "@/components/ProgramOverview";
import WhoIsAnEVL from "@/components/WhoIsAnEVL";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import SRLCrossPromo from "@/components/SRLCrossPromo";
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
import CampusAssistant from "@/components/CampusAssistant";

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
      <Helmet>
        <title>Corporate Volunteering Training — RW Regional Campus</title>
        <meta name="description" content="A 2-day, in-person training for corporate volunteering, CSR, and employee engagement leaders. Build community impact at scale. 2026 campuses in DC & Atlanta." />
        <meta name="keywords" content="corporate volunteering, employee volunteering, CSR training, corporate social responsibility, employee engagement, community impact, volunteer leadership, ESG, social impact, Realized Worth" />
        <link rel="canonical" href="https://rw-regional-campus.lovable.app/" />
        <meta property="og:url" content="https://rw-regional-campus.lovable.app/" />
        <meta property="og:title" content="Corporate Volunteering Training — RW Regional Campus" />
        <meta property="og:description" content="In-person training for CSR, corporate volunteering, and employee engagement leaders. 2026 campuses in Washington DC and Atlanta." />
      </Helmet>
      <Navbar onRegisterClick={openModal} />
      <HeroSection onRegisterClick={openModal} />
      <ProgramOverview />
      <WhoThisIsFor />
      <AgendaSection />
      <CitiesSection onNotifyClick={openModalWithCampus} />
      <FitAssessment onExpressInterest={openModal} />
      <PricingSection onRegisterClick={openModal} />
        <CertificationSection />
        <PostCampusCommunity />
        <SocialProof />
      <BecomeHost />
      <CampusTeam />
      <FAQSection />
      <CampusAssistant onExpressInterest={openModal} />
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
