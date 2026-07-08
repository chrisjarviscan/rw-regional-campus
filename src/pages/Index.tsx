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
import InfoSessions from "@/components/InfoSessions";
import PricingSection from "@/components/PricingSection";
import CertificationSection from "@/components/CertificationSection";
import PostCampusCommunity from "@/components/PostCampusCommunity";
import SocialProof from "@/components/SocialProof";
import BecomeHost from "@/components/BecomeHost";
import FitAssessment from "@/components/FitAssessment";
import IntendedOutcomes from "@/components/IntendedOutcomes";
import CampusTeam from "@/components/CampusTeam";
import FAQSection from "@/components/FAQSection";
import MakeTheCase from "@/components/MakeTheCase";
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
        <meta name="description" content="A 2-day, in-person training for corporate volunteering, CSR, and employee engagement leaders. Build community impact at scale. 2026–2027 campuses in DC, Atlanta, and the Bay Area." />
        <meta name="keywords" content="corporate volunteering, employee volunteering, CSR training, corporate social responsibility, employee engagement, community impact, volunteer leadership, ESG, social impact, Realized Worth" />
        <link rel="canonical" href="https://rw-regional-campus.lovable.app/" />
        <meta property="og:url" content="https://rw-regional-campus.lovable.app/" />
        <meta property="og:title" content="Corporate Volunteering Training — RW Regional Campus" />
        <meta property="og:description" content="In-person training for CSR, corporate volunteering, and employee engagement leaders. 2026–2027 campuses in Washington DC, Atlanta, and the Bay Area." />
      </Helmet>
      <Navbar />
      <HeroSection onRegisterClick={openModal} />
      <WhoIsAnEVL />
      <ProgramOverview />
      <FitAssessment onExpressInterest={openModal} />
      <WhoThisIsFor onExpressInterest={openModal} />
      <IntendedOutcomes />
      <SRLCrossPromo />
      <AgendaSection />
      <CitiesSection onNotifyClick={openModalWithCampus} />
      <InfoSessions />
      <PricingSection onRegisterClick={openModal} />
      <CertificationSection />
      <PostCampusCommunity />
      <SocialProof />
      <BecomeHost />
      <CampusTeam />
      <MakeTheCase />
      <FAQSection />
      <CampusAssistant onExpressInterest={openModal} />
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
