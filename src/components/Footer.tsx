import '../app/styles.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footerText">
        ✏️ 用心记录每一刻 · © {new Date().getFullYear()} Owen
      </p>
    </footer>
  )
}