'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Palette, Download, Eye, Zap, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PortfolioBuilder</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Build your dream portfolio in minutes</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Create Stunning
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Developer Portfolios</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Stand out from the crowd with a professionally designed portfolio.
            No coding required. Choose from beautiful themes and showcase your work in style.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
            >
              <span>Start Building Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/builder"
              className="flex items-center space-x-2 bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-gray-700 hover:border-gray-600 transition-all hover:scale-105"
            >
              <Eye className="w-5 h-5" />
              <span>Try Demo</span>
            </Link>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-1">
              <div className="bg-gray-800 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-gray-900 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">JD</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">John Doe</h3>
                    <p className="text-gray-400 mb-4">Full Stack Developer</p>
                    <div className="flex justify-center gap-2">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">React</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Node.js</span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">TypeScript</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to shine
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our portfolio builder comes packed with powerful features to help you create the perfect online presence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Palette className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Beautiful Themes</h3>
              <p className="text-gray-400">
                Choose from multiple professionally designed themes with customizable variants to match your style.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Live Preview</h3>
              <p className="text-gray-400">
                See your changes instantly with our real-time preview feature. What you see is what you get.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors group">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Export & Share</h3>
              <p className="text-gray-400">
                Export your portfolio as a static website or share it directly with a unique link.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-colors group">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Optimized for performance. Your portfolio loads instantly on any device.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-colors group">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Your data is encrypted and secure. Control who sees your portfolio.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-colors group">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">For Everyone</h3>
              <p className="text-gray-400">
                Whether you&apos;re a developer, designer, or creative professional, we&apos;ve got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 border border-gray-700/50">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to build your portfolio?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of professionals who have already created their dream portfolio.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">© 2025 PortfolioBuilder. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
