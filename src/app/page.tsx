import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">Personal Space</p>
          <h1 className="hero-title">
            在声音里<br/>遇见故事
          </h1>
          <p className="hero-subtitle">
            每一个夜晚，用声音陪伴你的独处时光
          </p>
          
          {/* Sound Wave */}
          <div className="sound-wave">
            {[15, 25, 35, 30, 20, 30, 40, 25, 15].map((height, i) => (
              <div 
                key={i} 
                className="wave-bar" 
                style={{ 
                  height: `${height}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          <Link href="/podcasts" className="cta-btn">
            <span>开始收听</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        
        {/* Ambient Orbs */}
        <div className="ambient-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-grid">
          <Link href="/podcasts" className="feature-card">
            <div className="feature-icon">🎙️</div>
            <h3>播客</h3>
            <p>用声音讲述故事，陪伴你的每一个夜晚</p>
          </Link>
          
          <Link href="/articles" className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>文章</h3>
            <p>记录思考与感悟，分享我的世界观</p>
          </Link>
          
          <Link href="/about" className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>关于</h3>
            <p>了解更多关于我的故事</p>
          </Link>
        </div>
      </section>

      <Footer />
      
      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 6rem 3rem;
        }
        
        .hero-content {
          text-align: center;
          max-width: 900px;
          position: relative;
          z-index: 1;
        }
        
        .hero-label {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-warm);
          margin-bottom: 1.5rem;
          animation: fadeInUp 1s ease 0.3s both;
        }
        
        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 600;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-warm) 50%, var(--text-primary) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s ease-in-out infinite, fadeInUp 1s ease 0.5s both;
        }
        
        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        
        .hero-subtitle {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 3rem;
          animation: fadeInUp 1s ease 0.7s both;
        }
        
        .sound-wave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 3rem;
          animation: fadeInUp 1s ease 0.9s both;
        }
        
        .wave-bar {
          width: 3px;
          background: var(--accent-warm);
          border-radius: 3px;
          animation: wave 1.5s ease-in-out infinite;
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50% { transform: scaleY(1.8); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          background: transparent;
          border: 1px solid var(--accent-warm);
          color: var(--accent-warm);
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1s ease 1.1s both;
        }
        
        .cta-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--accent-warm);
          transition: left 0.4s ease;
          z-index: -1;
        }
        
        .cta-btn:hover {
          color: var(--bg-primary);
        }
        
        .cta-btn:hover::before {
          left: 0;
        }
        
        .ambient-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }
        
        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
          top: -200px;
          right: -100px;
        }
        
        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(184, 115, 51, 0.1) 0%, transparent 70%);
          bottom: 20%;
          left: -100px;
          animation-delay: -10s;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        
        /* Features */
        .features {
          padding: 4rem 3rem 8rem;
          position: relative;
          z-index: 1;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 2.5rem;
          transition: all 0.4s ease;
          text-align: center;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 166, 107, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        
        .feature-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 4rem 1.5rem;
          }
          
          .features {
            padding: 2rem 1.5rem 6rem;
          }
        }
      `}</style>
    </>
  )
}