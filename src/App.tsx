import { useCallback, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Hero } from '@/components/sections/Hero';
import { StackMarquee } from '@/components/sections/StackMarquee';
import { WorkSection } from '@/components/sections/WorkSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { useCleanAnchors } from '@/hooks/useCleanAnchors';

export function App(): React.JSX.Element {
  useCleanAnchors();

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  return (
    <>
      <Header onOpenMenu={openMenu} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <main>
        <Hero />
        <StackMarquee />
        <WorkSection />
        <ProcessSection />
        <AboutSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
