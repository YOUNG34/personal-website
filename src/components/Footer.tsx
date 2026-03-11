export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">声波之间</div>
      <p className="footer-text">
        © {new Date().getFullYear()} 声波之间. 用声音陪伴每一个夜晚.
      </p>
      <style jsx>{`
        footer {
          padding: 4rem 3rem 6rem;
          text-align: center;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-subtle);
        }
        
        .footer-logo {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--accent-warm);
          margin-bottom: 1rem;
        }
        
        .footer-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </footer>
  )
}