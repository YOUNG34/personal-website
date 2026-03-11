import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import './styles.css'

export default function Home() {
  return (
    <>
      <Navigation />
      
      <section className="hero">
        <div className="heroContent">
          <div className="decorationTop" />
          
          <span className="heroLabel">✨ 个人博客</span>
          
          <h1 className="heroTitle">
            用文字记录<br/>生活的点滴
          </h1>
          
          <p className="heroSubtitle">
            在这里，我分享思考、记录感悟，与你一同成长
          </p>
          
          <Link href="/articles" className="heroCta">
            <span>浏览文章</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          
          <div className="decorationBottom" />
        </div>
      </section>

      <section className="features">
        <div className="featureGrid">
          <Link href="/articles" className="featureCard">
            <div className="featureIcon">📚</div>
            <h3>文章</h3>
            <p>记录思考与感悟，分享我对生活的理解</p>
          </Link>
          
          <Link href="/about" className="featureCard">
            <div className="featureIcon">👋</div>
            <h3>关于</h3>
            <p>了解更多关于我和这个博客的故事</p>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}