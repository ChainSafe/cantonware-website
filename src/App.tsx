import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

  const toggleCard = (cardId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  return (
    <div className="container">
      <nav>
        <ul>
          <li><strong>Cantonware</strong></li>
        </ul>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#contact">About</a></li>
        </ul>
      </nav>

      <main>
        <section id="home">
          <h1>Precision Tools for Financial Infrastructure</h1>
          <p>
            Production-ready developer tools and automation for DAML smart contracts and Canton blockchain. 
            Built by Cantonware, a joint venture between ChainSafe and Round13.
          </p>
        </section>

        <section id="products">
          <h2>Our Products</h2>
          <p>
            Open-source tools designed for DAML and Canton developers. Reduce setup time, automate testing, 
            and build safer smart contracts with verified patterns and compiler-integrated validation.
          </p>
          
          <div className="grid">
            <motion.article 
              className="flip-card"
              onClick={() => toggleCard('ci')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="flip-card-inner"
                animate={{ rotateY: flippedCards.has('ci') ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flip-card-front">
                  <div className="product-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3>CI Automation</h3>
                  <ul>
                    <li>Production-ready GitHub Actions for DAML and Canton CI workflows</li>
                    <li>Eliminate manual setup with one-line installations</li>
                    <li>Automate testing with DAML Sandbox and Canton LocalNet participant nodes</li>
                  </ul>
                  <div className="feature-grid">
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="5 12 3 14 5 16"></polyline>
                        <polyline points="9 18 7 20 9 22"></polyline>
                        <polyline points="13 6 11 8 13 10"></polyline>
                        <polyline points="17 12 15 14 17 16"></polyline>
                        <polyline points="21 8 19 10 21 12"></polyline>
                      </svg>
                      <div>
                        <strong>One-line installation</strong>
                        <p>DAML SDK and Canton setup simplified</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2.5 13.5a2.5 2.5 0 0 1 0-3l4.54-5.06A2.5 2.5 0 0 1 9.5 2z"></path>
                        <path d="M21 2l-4 4"></path>
                        <path d="M17 2l4 4"></path>
                      </svg>
                      <div>
                        <strong>Automated testing</strong>
                        <p>Sandbox and LocalNet integration</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                      <div>
                        <strong>CI optimized</strong>
                        <p>Streamlined workflow execution</p>
                      </div>
                    </article>
                  </div>
                  <small className="flip-hint">Click to see technical details →</small>
                </div>
                <div className="flip-card-back">
                  <header>
                    <h4>canton-ci</h4>
                    <p>GitHub Actions for DAML and Canton CI workflows</p>
                  </header>
                  <figure>
                    <figcaption>Install DAML SDK</figcaption>
                    <pre><code>{`- uses: ChainSafe/canton-ci/.github/actions/install-daml@main
  with:
    sdk_version: "3.4.0-snapshot.20251013.0"`}</code></pre>
                  </figure>
                  <figure>
                    <figcaption>Run DAML tests</figcaption>
                    <pre><code>{`daml_ci:
  uses: ChainSafe/canton-ci/.github/workflows/daml-ci.yaml@main`}</code></pre>
                  </figure>
                  <footer>
                    <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', textAlign: 'center', margin: 0 }}>
                      Click to see features
                    </p>
                  </footer>
                </div>
              </motion.div>
            </motion.article>

            <motion.article 
              className="flip-card"
              onClick={() => toggleCard('mcp')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="flip-card-inner"
                animate={{ rotateY: flippedCards.has('mcp') ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flip-card-front">
                  <div className="product-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <h3>Canton MCP Server</h3>
                  <ul>
                    <li>DAML-safe by construction development platform with AI-powered assistance</li>
                    <li>Access 3,667+ verified canonical resources with intelligent AI-powered recommendations</li>
                    <li>Validate code with compiler integration and formal verification</li>
                  </ul>
                  <div className="feature-grid">
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                      </svg>
                      <div>
                        <strong>Code validation</strong>
                        <p>Compiler-integrated safety checks</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        <path d="M8 7h6"></path>
                        <path d="M8 11h6"></path>
                        <path d="M8 15h4"></path>
                      </svg>
                      <div>
                        <strong>Canonical resources</strong>
                        <p>3,667+ verified patterns</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <div>
                        <strong>Debug assistance</strong>
                        <p>Authorization pattern recommendations</p>
                      </div>
                    </article>
                  </div>
                  <small className="flip-hint">Click to see technical details →</small>
                </div>
                <div className="flip-card-back">
                  <header>
                    <h4>canton-mcp-server</h4>
                    <p>MCP server for DAML code validation and authorization pattern recommendations</p>
                  </header>
                  <figure>
                    <figcaption>Start server</figcaption>
                    <pre><code>{`docker-compose up -d
# Server: http://localhost:7284/mcp`}</code></pre>
                  </figure>
                  <figure>
                    <figcaption>Available tools</figcaption>
                    <pre><code>validate_daml_business_logic
debug_authorization_failure
suggest_authorization_pattern
recommend_canonical_resources
get_canonical_resource_overview</code></pre>
                  </figure>
                  <footer>
                    <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', textAlign: 'center', margin: 0 }}>
                      Click to see features
                    </p>
                  </footer>
                </div>
              </motion.div>
            </motion.article>
          </div>
        </section>

        <section id="contact">
          <h2>About</h2>
          <p>
            Cantonware is a joint venture between ChainSafe and Round13, building precision tools 
            for the financial industry. Both tools are production-ready and available now.
          </p>
          <p>
            ChainSafe brings protocol engineering expertise from Ethereum, Polkadot, and Filecoin. 
            Round13 provides Web3 infrastructure investment. Together, we're accelerating Canton ecosystem growth 
            through developer tooling and blockchain infrastructure.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', marginTop: '1.5rem', fontStyle: 'italic' }}>
            Repositories will be made public soon.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a 
              href="https://github.com/ChainSafe/canton-ci" 
              role="button"
              className="github-link-disabled"
              onClick={(e) => e.preventDefault()}
            >
              canton-ci
            </a>
            <a 
              href="https://github.com/ChainSafe/canton-mcp-server" 
              role="button"
              className="github-link-disabled"
              onClick={(e) => e.preventDefault()}
            >
              canton-mcp-server
            </a>
          </div>
        </section>
      </main>

      <footer>
        <small>&copy; 2025 Cantonware. All rights reserved.</small>
      </footer>
    </div>
  )
}

export default App
