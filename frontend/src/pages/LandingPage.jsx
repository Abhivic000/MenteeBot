import { Link } from 'react-router-dom';
import { Heart, MessageCircle, PenTool, Shield, Users, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section animate-fade-in" style={{background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--primary-50) 100%)'}}>
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-6 animate-float">
            Your Journey to
            <span className="animate-gradient" style={{display: 'block', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent'}}>Mental Wellness</span>
          </h1>
          <p className="text-xl text-secondary mb-8" style={{maxWidth: '48rem', margin: '0 auto'}}>
            Share your healing stories, connect with others, and get personalized support through our AI-powered mental health companion.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn btn-primary btn-lg hover:scale-105">
              Start Your Journey
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg hover:scale-105">
              Welcome Back
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{backgroundColor: 'var(--bg-secondary)'}}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-secondary">
              Comprehensive tools to support your mental health journey
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:scale-105 transition animate-fade-in animate-glow">
              <div className="rounded-full flex items-center justify-center mx-auto mb-6 animate-float" style={{width: '4rem', height: '4rem', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))', boxShadow: 'var(--shadow-glow)'}}>
                <PenTool style={{width: '2rem', height: '2rem'}} className="text-green" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Share Your Story
              </h3>
              <p className="text-secondary">
                Write and share your healing journey. Inspire others with your progress and connect with a supportive community.
              </p>
            </div>

            <div className="card p-8 text-center hover:scale-105 transition animate-fade-in animate-glow" style={{animationDelay: '0.2s'}}>
              <div className="rounded-full flex items-center justify-center mx-auto mb-6 animate-float" style={{width: '4rem', height: '4rem', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))', boxShadow: 'var(--shadow-glow)', animationDelay: '1s'}}>
                <MessageCircle style={{width: '2rem', height: '2rem'}} className="text-green" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                AI Mental Health Assistant
              </h3>
              <p className="text-secondary">
                Get personalized support and guidance from our AI chatbot trained on mental health resources and best practices.
              </p>
            </div>

            <div className="card p-8 text-center hover:scale-105 transition animate-fade-in animate-glow" style={{animationDelay: '0.4s'}}>
              <div className="rounded-full flex items-center justify-center mx-auto mb-6 animate-float" style={{width: '4rem', height: '4rem', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-200))', boxShadow: 'var(--shadow-glow)', animationDelay: '2s'}}>
                <Users style={{width: '2rem', height: '2rem'}} className="text-green" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Supportive Community
              </h3>
              <p className="text-secondary">
                Connect with others on similar journeys. Read inspiring stories and find strength in shared experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose MenteeBot?
              </h2>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <Shield style={{width: '1.5rem', height: '1.5rem'}} className="text-green mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      Safe & Secure
                    </h3>
                    <p className="text-secondary">
                      Your privacy is our priority. All data is encrypted and securely stored.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Sparkles style={{width: '1.5rem', height: '1.5rem'}} className="text-green mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      Evidence-Based Support
                    </h3>
                    <p className="text-secondary">
                      Our AI is trained on proven mental health resources and therapeutic approaches.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Heart style={{width: '1.5rem', height: '1.5rem'}} className="text-green mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      24/7 Availability
                    </h3>
                    <p className="text-secondary">
                      Get support whenever you need it. Our platform is always here for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-8 hover:scale-105 transition">
              <div className="text-center">
                <div className="animate-gradient rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '6rem', height: '6rem'}}>
                  <Heart style={{width: '3rem', height: '3rem', color: 'white'}} />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Start Healing Today
                </h3>
                <p className="text-secondary mb-6">
                  Join thousands of others who have found support and healing through our platform.
                </p>
                <Link to="/register" className="btn btn-primary w-full">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}