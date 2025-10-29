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
            <h2 className="section-title">Production-Ready Developer Tools</h2>
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#6b7280', maxWidth: '800px', margin: '0 auto 48px', lineHeight: '1.6' }}>
              Open-source tools designed for DAML and Canton developers. Reduce setup time, automate testing, 
              and build safer smart contracts with verified patterns and compiler-integrated validation.
            </p>
            
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
                  GitHub Actions workflows that eliminate manual DAML and Canton setup in CI environments. Install DAML SDK 
                  and Canton with a single action, run Sandbox tests, and execute DAML scripts against LocalNet participant nodes.
                </p>
                <ul className="product-features">
                  <li>Install DAML SDK without manual dependency management</li>
                  <li>One-step Canton installation with version control</li>
                  <li>Automated `daml test` execution in clean Sandbox environments</li>
                  <li>Run `daml script` against Canton LocalNet nodes with automatic port configuration</li>
                  <li>Support for JSON API (port 7575) and Ledger API (port 6865)</li>
                </ul>
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#111827' }}>Quick Start:</strong>
                  <code style={{ color: '#374151', display: 'block', whiteSpace: 'pre-wrap' }}>{`- uses: ChainSafe/canton-ci/.github/actions/install-daml@main
  with:
    sdk_version: "3.4.0-snapshot.20251013.0"`}</code>
                </div>
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
                  MCP server providing DAML-safe code generation with compiler-integrated validation. Query 3,667+ canonical 
                  resources from DAML, Canton, and DAML Finance repositories. Debug authorization failures and get pattern 
                  suggestions validated through DAML compilation.
                </p>
                <ul className="product-features">
                  <li>Validate DAML templates against canonical authorization patterns</li>
                  <li>Debug authorization errors with detailed compiler-based analysis</li>
                  <li>Get pattern recommendations by use case, security level, and complexity</li>
                  <li>Access canonical resources via GitHub API verification</li>
                  <li>HTTP+SSE transport with DCAP performance tracking</li>
                  <li>Docker deployment with hot-reload for development</li>
                </ul>
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px' }}>
                  <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#111827' }}>Available Tools:</strong>
                  <code style={{ color: '#374151', display: 'block' }}>validate_daml_business_logic</code>
                  <code style={{ color: '#374151', display: 'block' }}>debug_authorization_failure</code>
                  <code style={{ color: '#374151', display: 'block' }}>suggest_authorization_pattern</code>
                  <code style={{ color: '#374151', display: 'block' }}>recommend_canonical_resources</code>
                </div>
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
            <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '700px', margin: '1rem auto 0', lineHeight: '1.6' }}>
              ChainSafe brings protocol engineering expertise from Ethereum, Polkadot, and Filecoin. 
              Round13 provides Web3 infrastructure investment. Together, we're accelerating Canton ecosystem growth 
              through developer tooling and blockchain infrastructure.
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
