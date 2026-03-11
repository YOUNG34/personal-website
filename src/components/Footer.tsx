import '../app/styles.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footerText">
        ✏️ Owen's Notebook · © {new Date().getFullYear()} Owen
      </p>
    </footer>
  )
}