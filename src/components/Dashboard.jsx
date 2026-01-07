import { Link } from 'react-router-dom'
import lessonsData from '../data/lessons.json'

function Dashboard({ onLogout }) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h1>Study Review</h1>
          </div>
          <div className="header-actions">
            <span className="faceid-status">✅ FaceID</span>
            <button onClick={onLogout} className="logout-btn">Đăng xuất</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Xin chào! 👋</h2>
          <p>Chọn một chương để bắt đầu ôn luyện</p>
        </div>

        <div className="chapters-grid">
          {lessonsData.chapters.map((chapter, index) => (
            <Link 
              key={chapter.id} 
              to={`/chapter/${chapter.id}`}
              className="chapter-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="chapter-icon">{chapter.icon}</div>
              <div className="chapter-info">
                <h3 className="chapter-title">{chapter.title}</h3>
                <p className="chapter-desc">{chapter.description}</p>
                <div className="chapter-meta">
                  <span className="doc-count">{chapter.documents.length} tài liệu</span>
                </div>
              </div>
              <div className="chapter-arrow">→</div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Ôn luyện mọi lúc mọi nơi 🚀</p>
      </footer>
    </div>
  )
}

export default Dashboard
