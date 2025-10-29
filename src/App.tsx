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
            <h1 className="hero-title">Developer tools for DAML and Canton</h1>
            <p className="hero-subtitle">
              GitHub Actions for CI workflows and MCP server for code validation
            </p>
          </div>
        </section>

        <section id="products" className="products">
          <div className="container">
            <h2 className="section-title">Tools</h2>
            
            <div className="product-grid">
              <div className="product-card">
                <div className="product-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="product-title">canton-ci</h3>
                <p className="product-description">
                  GitHub Actions for DAML and Canton CI workflows
                </p>
                <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Install DAML SDK</div>
                  <code style={{ color: '#111827', display: 'block', whiteSpace: 'pre-wrap' }}>{`- uses: ChainSafe/canton-ci/.github/actions/install-daml@main
  with:
    sdk_version: "3.4.0-snapshot.20251013.0"`}</code>
                </div>
                <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Run DAML tests</div>
                  <code style={{ color: '#111827', display: 'block', whiteSpace: 'pre-wrap' }}>{`daml_ci:
  uses: ChainSafe/canton-ci/.github/workflows/daml-ci.yaml@main`}</code>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <a 
                    href="https://github.com/ChainSafe/canton-ci" 
                    className="product-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub →
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
                <h3 className="product-title">canton-mcp-server</h3>
                <p className="product-description">
                  MCP server for DAML code validation and authorization pattern recommendations
                </p>
                <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start server</div>
                  <code style={{ color: '#111827', display: 'block', whiteSpace: 'pre-wrap' }}>{`docker-compose up -d
# Server: http://localhost:7284/mcp`}</code>
                </div>
                <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                  <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available tools</div>
                  <code style={{ color: '#111827', display: 'block' }}>validate_daml_business_logic</code>
                  <code style={{ color: '#111827', display: 'block', marginTop: '0.5rem' }}>debug_authorization_failure</code>
                  <code style={{ color: '#111827', display: 'block', marginTop: '0.5rem' }}>suggest_authorization_pattern</code>
                  <code style={{ color: '#111827', display: 'block', marginTop: '0.5rem' }}>recommend_canonical_resources</code>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <a 
                    href="https://github.com/ChainSafe/canton-mcp-server" 
                    className="product-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title">About</h2>
            <p className="contact-text" style={{ maxWidth: '600px' }}>
              Cantonware is a joint venture between ChainSafe and Round13, 
              building developer tools for the Canton ecosystem.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a 
                href="https://github.com/ChainSafe/canton-ci" 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                canton-ci
              </a>
              <a 
                href="https://github.com/ChainSafe/canton-mcp-server" 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                canton-mcp-server
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
