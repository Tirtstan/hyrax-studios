import './App.css'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { GamesSection } from './components/GamesSection'
import { HeroSection } from './components/HeroSection'
import { SiteHeader } from './components/SiteHeader'
import { TeamSection } from './components/TeamSection'

function App() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">
        <HeroSection />
        <GamesSection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default App
