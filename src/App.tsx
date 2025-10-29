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
            <h1 className="hero-title">Professional Developer Tools</h1>
            <p className="hero-subtitle">
              Streamline your development workflow with our suite of powerful automation tools
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
                  A GitHub app designed to automate your continuous integration workflows. 
                  Streamline your build, test, and deployment processes with intelligent automation.
                </p>
                <ul className="product-features">
                  <li>Automated workflow triggers</li>
                  <li>Smart build optimization</li>
                  <li>Seamless GitHub integration</li>
                  <li>Custom pipeline configuration</li>
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
                <h3 className="product-title">DAML MCP Server</h3>
                <p className="product-description">
                  An MCP (Model Context Protocol) server specialized for DAML code generation. 
                  Accelerate your smart contract development with AI-powered code assistance.
                </p>
                <ul className="product-features">
                  <li>Intelligent code generation</li>
                  <li>DAML-specific optimizations</li>
                  <li>Context-aware suggestions</li>
                  <li>Standards-compliant output</li>
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
              Explore our tools on GitHub and start improving your development workflow today.
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
