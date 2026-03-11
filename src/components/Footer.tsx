import '../app/styles.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footerText">
        © {new Date().getFullYear()} 文字之间 · 记录思考与感悟
      </p>
    </footer>
  )
}