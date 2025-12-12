import React, { useState, useEffect } from 'react';
import { 
  FaPlane, 
  FaBox, 
  FaShieldAlt, 
  FaRocket, 
  FaDollarSign, 
  FaGlobe,
  FaCheckCircle,
  FaUserCheck,
  FaCamera,
  FaChartLine,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <FaPlane className="logo-icon" />
              <span className="logo-text">Travel<span className="highlight">X</span></span>
            </div>
            
            <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
            </div>

            <div className="nav-buttons">
              <button className="btn-secondary">Login</button>
              <button className="btn-primary">Get Started</button>
            </div>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text fade-in">
              <h1 className="hero-title">
                Turn Your Travel Into
                <span className="gradient-text"> Profit</span>
              </h1>
              <p className="hero-subtitle">
                Connect travelers with senders for secure, affordable cross-border delivery. 
                Monetize your luggage space or ship parcels globally at 50% lower costs.
              </p>
              <div className="hero-buttons">
                <button className="btn-hero-primary">
                  Start Earning
                  <FaRocket className="btn-icon" />
                </button>
                <button className="btn-hero-secondary">
                  Send a Parcel
                  <FaBox className="btn-icon" />
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <h3>10K+</h3>
                  <p>Active Travelers</p>
                </div>
                <div className="stat-item">
                  <h3>50K+</h3>
                  <p>Deliveries Made</p>
                </div>
                <div className="stat-item">
                  <h3>120+</h3>
                  <p>Countries</p>
                </div>
              </div>
            </div>

            <div className="hero-visual slide-in-right">
              <div className="visual-card card-1">
                <div className="card-icon orange">
                  <FaPlane />
                </div>
                <h4>Travelers Earn</h4>
                <p className="price">$50-200</p>
                <p className="desc">per trip</p>
              </div>
              
              <div className="visual-card card-2">
                <div className="card-icon teal">
                  <FaBox />
                </div>
                <h4>Senders Save</h4>
                <p className="price">50%</p>
                <p className="desc">vs couriers</p>
              </div>

              <div className="visual-card card-3">
                <div className="card-icon blue">
                  <FaShieldAlt />
                </div>
                <h4>AI Verified</h4>
                <p className="price">100%</p>
                <p className="desc">secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose <span className="gradient-text">TravelX</span>?</h2>
            <p className="section-subtitle">
              AI-powered security meets peer-to-peer logistics
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon orange">
                <FaUserCheck />
              </div>
              <h3>Biometric Verification</h3>
              <p>
                Two-step facial recognition ensures both travelers and senders are verified 
                with government-issued ID. 100% secure identity matching.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon teal">
                <FaCamera />
              </div>
              <h3>AI Content Screening</h3>
              <p>
                Advanced image classification automatically scans parcel photos to detect 
                prohibited items before delivery acceptance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                <FaCheckCircle />
              </div>
              <h3>Ticket OCR Proof</h3>
              <p>
                Smart OCR technology validates flight tickets, ensuring travelers have 
                confirmed bookings matching their posted routes.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">
                <FaDollarSign />
              </div>
              <h3>Flexible Pricing</h3>
              <p>
                Negotiate rates directly through our secure chat. Travelers set their prices, 
                senders find the best deals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon teal">
                <FaGlobe />
              </div>
              <h3>Global Network</h3>
              <p>
                Connect with travelers heading to 120+ countries. Find routes traditional 
                couriers don't serve efficiently.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                <FaChartLine />
              </div>
              <h3>Real-Time Tracking</h3>
              <p>
                Track your parcel from pickup to delivery with live updates and instant 
                messaging between both parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-subtitle">Simple, secure, and smart logistics in 3 steps</p>
          </div>

          <div className="works-container">
            {/* For Travelers */}
            <div className="works-column">
              <div className="column-header traveler">
                <FaPlane className="column-icon" />
                <h3>For Travelers</h3>
              </div>
              
              <div className="steps">
                <div className="step-item">
                  <div className="step-number orange">1</div>
                  <div className="step-content">
                    <h4>Verify Identity</h4>
                    <p>Complete biometric verification with CNIC and live selfie</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number orange">2</div>
                  <div className="step-content">
                    <h4>Post Your Trip</h4>
                    <p>Upload e-ticket, add route details and available luggage space</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number orange">3</div>
                  <div className="step-content">
                    <h4>Accept & Deliver</h4>
                    <p>Review requests, negotiate price, and earn money for delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Senders */}
            <div className="works-column">
              <div className="column-header sender">
                <FaBox className="column-icon" />
                <h3>For Senders</h3>
              </div>
              
              <div className="steps">
                <div className="step-item">
                  <div className="step-number teal">1</div>
                  <div className="step-content">
                    <h4>Verify Identity</h4>
                    <p>Complete biometric verification with CNIC and live selfie</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number teal">2</div>
                  <div className="step-content">
                    <h4>Find Traveler</h4>
                    <p>Search routes, upload parcel photos for AI screening</p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number teal">3</div>
                  <div className="step-content">
                    <h4>Track Delivery</h4>
                    <p>Confirm booking, track in real-time until delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple <span className="gradient-text">Pricing</span></h2>
            <p className="section-subtitle">No hidden fees. Just transparent costs.</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>For Travelers</h3>
                <div className="price-tag">
                  <span className="price">15%</span>
                  <span className="period">commission</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><FaCheckCircle /> Unlimited trip postings</li>
                <li><FaCheckCircle /> AI ticket verification</li>
                <li><FaCheckCircle /> Secure in-app messaging</li>
                <li><FaCheckCircle /> Rating & review system</li>
                <li><FaCheckCircle /> 24/7 support</li>
              </ul>
              <button className="btn-pricing">Start Earning</button>
            </div>

            <div className="pricing-card featured">
              <div className="featured-badge">Popular</div>
              <div className="pricing-header">
                <h3>For Senders</h3>
                <div className="price-tag">
                  <span className="price">$5</span>
                  <span className="period">per booking</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><FaCheckCircle /> Unlimited searches</li>
                <li><FaCheckCircle /> AI parcel screening</li>
                <li><FaCheckCircle /> Real-time tracking</li>
                <li><FaCheckCircle /> Secure payments</li>
                <li><FaCheckCircle /> Insurance options</li>
              </ul>
              <button className="btn-pricing">Send Parcel</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price-tag">
                  <span className="price">Custom</span>
                  <span className="period">pricing</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><FaCheckCircle /> Bulk deliveries</li>
                <li><FaCheckCircle /> Dedicated account manager</li>
                <li><FaCheckCircle /> API access</li>
                <li><FaCheckCircle /> Custom integrations</li>
                <li><FaCheckCircle /> Priority support</li>
              </ul>
              <button className="btn-pricing">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Cross-Border Delivery?</h2>
            <p>Join thousands of travelers and senders using TravelX today</p>
            <div className="cta-buttons">
              <button className="btn-cta-primary">Get Started Free</button>
              <button className="btn-cta-secondary">Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
                <FaPlane className="logo-icon" />
                <span className="logo-text">Travel<span className="highlight">X</span></span>
              </div>
              <p className="footer-desc">
                AI-powered peer-to-peer logistics connecting travelers with senders globally.
              </p>
            </div>

            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#about">About Us</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#safety">Safety Guidelines</a></li>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#terms">Terms of Service</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
                <li><a href="#compliance">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 TravelX. All rights reserved.</p>
            <div className="footer-social">
              <a href="#twitter">Twitter</a>
              <a href="#linkedin">LinkedIn</a>
              <a href="#facebook">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
