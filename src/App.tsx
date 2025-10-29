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
              Production-ready developer tools and automation for DAML smart contracts and Canton blockchain. 
              Built by Cantonware, a joint venture between ChainSafe and Round13.
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
                  Production-ready GitHub Actions for DAML and Canton CI workflows. Eliminate manual setup with 
                  one-line installations. Automate testing with DAML Sandbox and Canton LocalNet participant nodes.
                </p>
                <ul className="product-features">
                  <li>One-line DAML SDK installation</li>
                  <li>Automated Canton setup</li>
                  <li>Integrated Sandbox testing workflows</li>
                  <li>Canton LocalNet script execution</li>
                </ul>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a 
                    href="https://github.com/ChainSafe/canton-ci" 
                    className="product-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository →
                  </a>
                </div>
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
                  DAML-safe by construction development platform with AI-powered assistance. Access 3,667+ verified 
                  canonical resources. Validate code with compiler integration and formal verification.
                </p>
                <ul className="product-features">
                  <li>DAML business logic validation</li>
                  <li>Authorization failure debugging</li>
                  <li>Intelligent pattern recommendations</li>
                  <li>Production-ready with Docker support</li>
                </ul>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <a 
                    href="https://github.com/ChainSafe/canton-mcp-server" 
                    className="product-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Repository →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title">Get Started</h2>
            <p className="contact-text">
              Cantonware is a joint venture between ChainSafe and Round13, building precision tools 
              for the financial industry. Both tools are production-ready and available now.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a 
                href="https://github.com/ChainSafe/canton-ci" 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
                style={{ minWidth: '200px' }}
              >
                canton-ci Repository
              </a>
              <a 
                href="https://github.com/ChainSafe/canton-mcp-server" 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
                style={{ minWidth: '200px' }}
              >
                canton-mcp-server Repository
              </a>
            </div>
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
