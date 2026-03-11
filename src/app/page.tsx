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
          <p className="heroLabel">Personal Space</p>
          <h1 className="heroTitle">
            文字之间<br/>记录思考
          </h1>
          <p className="heroSubtitle">
            用文字记录生活，分享思考与感悟
          </p>
          
          <Link href="/articles" className="ctaBtn">
            <span>开始阅读</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        
        <div className="ambientBg">
          <div className="orb orb1" />
          <div className="orb orb2" />
        </div>
      </section>

      <section className="features">
        <div className="featureGrid">
          <Link href="/articles" className="featureCard">
            <div className="featureIcon">📝</div>
            <h3>文章</h3>
            <p>记录思考与感悟，分享我的世界观</p>
          </Link>
          
          <Link href="/about" className="featureCard">
            <div className="featureIcon">✨</div>
            <h3>关于</h3>
            <p>了解更多关于我的故事</p>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}