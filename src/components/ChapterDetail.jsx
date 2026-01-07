import { useParams, Link } from 'react-router-dom'
import lessonsData from '../data/lessons.json'

function ChapterDetail() {
  const { chapterId } = useParams()
  
  const chapter = lessonsData.chapters.find(c => c.id === chapterId)
  
  if (!chapter) {
    return (
      <div className="error-page">
        <h1>Không tìm thấy chương</h1>
        <Link to="/" className="back-link">← Quay lại Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="chapter-detail">
      <header className="detail-header">
        <Link to="/" className="back-btn">
          ← Quay lại
        </Link>
        <div className="chapter-title-section">
          <span className="chapter-icon-large">{chapter.icon}</span>
          <h1>{chapter.title}</h1>
        </div>
      </header>

      <main className="detail-main">
        <p className="chapter-description">{chapter.description}</p>
        
        <div className="documents-list">
          <h2>Tài liệu trong chương</h2>
          
          {chapter.documents.map((doc, index) => (
            <Link 
              key={doc.id}
              to={`/chapter/${chapterId}/${doc.id}`}
              className="document-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="doc-icon">{doc.icon}</div>
              <div className="doc-info">
                <h3>{doc.title}</h3>
                <span className={`doc-type doc-type-${doc.type}`}>
                  {doc.type === 'translation' ? 'Bản dịch' : 
                   doc.type === 'explanation' ? 'Giải thích' : doc.type}
                </span>
              </div>
              <div className="doc-arrow">→</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ChapterDetail
