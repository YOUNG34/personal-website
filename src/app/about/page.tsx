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
              欢迎来到我的个人空间。这里是记录声音、文字与思考的地方。
            </p>
            <p>
              我相信，每一个夜晚都值得被温柔对待。通过播客，我用声音陪伴你的独处时光；通过文字，我记录下那些值得被记住的瞬间。
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