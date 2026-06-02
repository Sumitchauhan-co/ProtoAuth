import BentoGridFeature from '@/components/home/BentoGridFeature';
import Cards from '@/components/home/Cards';
import FaqsSection from '@/components/home/Faqs';
import Hero from '@/components/home/Hero';
import LogoCloud from '@/components/home/LogoCloud';

const Home = () => {
    return (
        <main className="min-h-screen w-full flex flex-col bg-white dark:bg-black">
            <Hero />
            <LogoCloud />
            <BentoGridFeature />
            <Cards />
            <FaqsSection/>
        </main>
    );
};

export default Home;
