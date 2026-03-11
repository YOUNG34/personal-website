import '../app/styles.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footerText">
        © {new Date().getFullYear()} 声波之间 · 在声音里遇见故事
      </p>
    </footer>
  )
}