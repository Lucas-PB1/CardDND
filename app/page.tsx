
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            CardND
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-950 to-gray-950 -z-10" />
        
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            The Ultimate <span className="text-blue-500">D&D</span> Companion
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage your campaigns, roll dice, and track your adventures with a system built for 
            Dungeon Masters and Players alike. Perfect for both online sessions and offline table management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/register">
              <Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                Start Your Adventure
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" className="h-12 px-8 text-lg">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400">Dozens of powerful tools at your fingertips.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                ⚔️
              </div>
              <h3 className="text-xl font-bold mb-3">Campaign Management</h3>
              <p className="text-gray-400">Organize your NPCs, locations, and plot hooks in one centralized dashboard.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                🎲
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Dice Roller</h3>
              <p className="text-gray-400">Physics-based 3D dice rolling or quick formulas. Integrates with character stats.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                📡
              </div>
              <h3 className="text-xl font-bold mb-3">Offline Mode</h3>
              <p className="text-gray-400">Playing at a cabin in the woods? Access your sheets and notes without internet.</p>
            </div>
             
             {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 text-orange-400">
                🧙‍♂️
              </div>
              <h3 className="text-xl font-bold mb-3">Character Builder</h3>
              <p className="text-gray-400">Create characters in minutes with our guided wizard. Supports 5e rules automatically.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 text-red-400">
                🔥
              </div>
              <h3 className="text-xl font-bold mb-3">Combat Tracker</h3>
              <p className="text-gray-400">Track initiative, HP, and conditions seamlessly. Speed up your combat encounters.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 text-cyan-400">
                📦
              </div>
              <h3 className="text-xl font-bold mb-3">Item Database</h3>
              <p className="text-gray-400">Browse thousands of magical items and spells. Add them to your inventory with a click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/40 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CardND. All rights reserved.</p>
      </footer>
    </div>
  );
}
