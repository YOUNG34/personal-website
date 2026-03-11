import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

// 播客数据 - 可以从文件或 CMS 获取
const podcasts = [
  {
    number: 12,
    title: '深夜咖啡馆的陌生人',
    description: '在城市最安静的角落，我遇见了一个讲述故事的人。关于孤独，关于相遇，关于那些我们从未说出口的话。',
    date: '2024.03.08',
    duration: '32 分钟',
  },
  {
    number: 11,
    title: '雨天的地铁',
    description: '雨水打在车窗上，模糊了城市的轮廓。每个人都在等待，等待一个目的地，或者只是等待雨停。',
    date: '2024.03.01',
    duration: '28 分钟',
  },
  {
    number: 10,
    title: '旧时光的书店',
    description: '推开那扇吱呀作响的木门，空气里是纸张和岁月的味道。店主说，每本书都在等待它的读者。',
    date: '2024.02.22',
    duration: '35 分钟',
  },
  {
    number: 9,
    title: '阳台上的星星',
    description: '城市的灯光太亮，但偶尔还是能在阳台看见星星。那些遥远的光，走了多少年才来到这里。',
    date: '2024.02.15',
    duration: '25 分钟',
  },
]

export default function PodcastsPage() {
  return (
    <>
      <Navigation />
      
      <main className="main">
        <header className="page-header">
          <p className="section-label">Podcasts</p>
          <h1 className="section-title">播客</h1>
          <p className="section-desc">用声音讲述故事，陪伴你的每一个夜晚</p>
        </header>

        <div className="podcasts-grid">
          {podcasts.map((podcast) => (
            <div key={podcast.number} className="podcast-card">
              <div className="podcast-number">{String(podcast.number).padStart(2, '0')}</div>
              <h3 className="podcast-title">{podcast.title}</h3>
              <p className="podcast-desc">{podcast.description}</p>
              <div className="podcast-meta">
                <span>{podcast.date}</span>
                <span>{podcast.duration}</span>
              </div>
              <button className="play-btn" aria-label="播放">
                <svg viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Subscribe Section */}
        <section className="subscribe">
          <h2>订阅收听</h2>
          <div className="platforms">
            <a href="#" className="platform">
              🎧 Apple Podcasts
            </a>
            <a href="#" className="platform">
              🎵 Spotify
            </a>
            <a href="#" className="platform">
              📻 小宇宙
            </a>
            <a href="#" className="platform">
              📱 喜马拉雅
            </a>
          </div>
        </section>
      </main>

      <Footer />
      
      <style jsx>{`
        .main {
          min-height: 100vh;
          padding: 8rem 3rem 4rem;
          position: relative;
          z-index: 1;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .section-label {
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent-warm);
          margin-bottom: 1rem;
        }
        
        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 1rem;
        }
        
        .section-desc {
          color: var(--text-secondary);
          font-size: 1rem;
        }
        
        .podcasts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 4rem;
        }
        
        .podcast-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 2rem;
          transition: all 0.4s ease;
          position: relative;
          cursor: pointer;
        }
        
        .podcast-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 166, 107, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .podcast-number {
          font-family: var(--font-serif);
          font-size: 3rem;
          font-weight: 700;
          color: var(--accent-warm);
          opacity: 0.3;
          line-height: 1;
          margin-bottom: 1rem;
        }
        
        .podcast-title {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        
        .podcast-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        
        .podcast-meta {
          display: flex;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .play-btn {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent-warm);
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          transform: scale(0.8);
        }
        
        .podcast-card:hover .play-btn {
          opacity: 1;
          transform: scale(1);
        }
        
        .play-btn svg {
          width: 20px;
          height: 20px;
          fill: var(--bg-primary);
          margin-left: 3px;
        }
        
        .subscribe {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-secondary);
          border-radius: 16px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .subscribe h2 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .platforms {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }
        
        .platform {
          padding: 0.75rem 1.5rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .platform:hover {
          border-color: var(--accent-warm);
          color: var(--accent-warm);
        }

        @media (max-width: 768px) {
          .main {
            padding: 6rem 1.5rem 3rem;
          }
          
          .podcasts-grid {
            grid-template-columns: 1fr;
          }
          
          .platforms {
            flex-direction: column;
            align-items: center;
          }
          
          .platform {
            width: 100%;
            max-width: 250px;
            text-align: center;
          }
        }
      `}</style>
    </>
  )
}