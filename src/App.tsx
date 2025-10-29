import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">Cantonware</div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container">
            <h1 className="hero-title">Precision Tools for Financial Infrastructure</h1>
            <p className="hero-subtitle">
              Developer tools and automation for DAML smart contracts and Canton blockchain development
            </p>
          </div>
        </section>

        <section id="products" className="products">
          <div className="container">
            <h2 className="section-title">Our Products</h2>
            
            <div className="product-grid">
              <div className="product-card">
                <div className="product-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="product-title">CI Automation</h3>
                <p className="product-description">
                  GitHub Actions for DAML and Canton CI workflows. Simplify installation, testing, and deployment 
                  of DAML smart contracts and Canton participant nodes.
                </p>
                <ul className="product-features">
                  <li>DAML SDK installation workflow</li>
                  <li>Canton installation automation</li>
                  <li>DAML Sandbox testing</li>
                  <li>Canton LocalNet integration</li>
                </ul>
                <a href="#ci" className="product-link">Learn More →</a>
              </div>

              <div className="product-card">
                <div className="product-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h3 className="product-title">Canton MCP Server</h3>
                <p className="product-description">
                  DAML-safe by construction development platform. Generate provably safe DAML code with verified 
                  patterns, compiler integration, and validation tools.
                </p>
                <ul className="product-features">
                  <li>DAML code validation</li>
                  <li>Authorization pattern suggestions</li>
                  <li>Canonical resource library</li>
                  <li>Compiler-based safety checks</li>
                </ul>
                <a href="#daml" className="product-link">Learn More →</a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title">Get Started</h2>
            <p className="contact-text">
              Cantonware is a joint venture between ChainSafe and Round13, building precision tools 
              for the financial industry. Explore our open-source tools on GitHub.
            </p>
            <a 
              href="https://github.com/ChainSafe" 
              className="contact-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Cantonware. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
