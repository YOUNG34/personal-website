import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import '../styles.css'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      
      <main className="aboutMain">
        <div className="aboutContent">
          <h1 className="aboutTitle">👋 关于我</h1>
          
          <div className="aboutText">
            <p>
              你好！欢迎来到我的博客。这里是记录生活、分享思考的小角落。
            </p>
            <p>
              我相信，生活中的每一个瞬间都值得被记录。无论是技术探索的喜悦，还是日常生活的感悟，我都希望用文字将它们留下。
            </p>
            <p>
              这个博客是我的个人空间，也是与你分享的窗口。如果你喜欢这里的内容，欢迎常来坐坐。
            </p>
            <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--accent-primary)' }}>
              ✉️ zeyangyz@icloud.com
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}