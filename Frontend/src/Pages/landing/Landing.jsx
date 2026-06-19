import CTASection from '../../components/landingComponents/CTASection';
import FeaturesSection from '../../components/landingComponents/FeaturesSection';
import HeroSection from '../../components/landingComponents/HeroSection';
import LandingFooter from '../../components/landingComponents/LandingFooter';
import LandingNavbar from '../../components/landingComponents/LandingNadvar';
import ProjectCarousel from '../../components/landingComponents/ProjectCarousel';
import StatsSection from '../../components/landingComponents/StatsSection';
import './Landing.css';

export default function LandingPage() {
    return (
        <>
            <LandingNavbar />

            <main>
                <HeroSection />
                <ProjectCarousel />
                <FeaturesSection />
                <StatsSection />
                <CTASection />
            </main>

            <LandingFooter />
        </>
    );
}