import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import '../styles.css'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      
      <main className="aboutMain">
        <div className="aboutContent">
          <h1 className="aboutTitle">关于</h1>
          
          <div className="aboutText">
            <p>
              欢迎来到我的个人空间。这里是记录文字与思考的地方。
            </p>
            <p>
              通过文字，我记录下那些值得被记住的瞬间，分享我对生活的理解与感悟。
            </p>
            <p>
              如果你喜欢这里的内容，欢迎常来坐坐。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}