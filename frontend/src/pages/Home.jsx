import { Link } from 'react-router-dom'

export default function Home() {
  const isAuthed = Boolean(localStorage.getItem('access'))

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 via-transparent to-accent-secondary/10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="text-center space-y-6">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
                Cookbook
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              Discover, create, and share your favorite recipes. A modern platform to collect and organize all your culinary inspirations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthed && (
                <Link
                  to="/recipes"
                  className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250 text-center"
                >
                  Browse Recipes
                </Link>
              )}
              {!isAuthed && (
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250 text-center"
                >
                  Sign In
                </Link>
              )}
              {!isAuthed && (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-dark-surface-light hover:bg-dark-surface border border-accent-primary/50 text-accent-primary rounded-lg font-semibold transition-all duration-250 text-center"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
          Why Choose Cookbook?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-dark-surface rounded-xl p-8 border border-dark-surface-light hover:border-accent-primary/50 transition-all duration-250 hover:shadow-card">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-white mb-3">Visual Recipes</h3>
            <p className="text-gray-400">
              Upload beautiful images of your dishes and watch your culinary creations come to life.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-dark-surface rounded-xl p-8 border border-dark-surface-light hover:border-accent-secondary/50 transition-all duration-250 hover:shadow-card">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-3">Easy Search</h3>
            <p className="text-gray-400">
              Find recipes by title or ingredients instantly. Discover what you can make with what you have.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-dark-surface rounded-xl p-8 border border-dark-surface-light hover:border-accent-success/50 transition-all duration-250 hover:shadow-card">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-white mb-3">Video Tutorials</h3>
            <p className="text-gray-400">
              Embed YouTube videos to guide you through every step of your favorite recipes.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl border border-accent-primary/30 p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6">
            Join our community and start collecting your recipes today.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-250"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  )
}
