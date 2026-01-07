import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import lessonsData from '../data/lessons.json'

function DocumentViewer() {
  const { chapterId, docId } = useParams()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const chapter = lessonsData.chapters.find(c => c.id === chapterId)
  const doc = chapter?.documents.find(d => d.id === docId)

  useEffect(() => {
    if (!doc) {
      setError('Không tìm thấy tài liệu')
      setIsLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        // Build the correct path - handle both dev and production
        const basePath = import.meta.env.BASE_URL || '/'
        const filePath = `${basePath}lessons/${chapterId}/${doc.file}`
        
        console.log('[DocumentViewer] Fetching:', filePath)
        
        const response = await fetch(filePath)
        
        console.log('[DocumentViewer] Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`Không thể tải tài liệu (HTTP ${response.status})`)
        }
        
        const text = await response.text()
        
        // Check if we got HTML error page instead of markdown
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error('File không tồn tại - nhận được HTML thay vì Markdown')
        }
        
        setContent(text)
        setError(null)
      } catch (err) {
        console.error('[DocumentViewer] Error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [chapterId, docId, doc])

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner-large"></div>
        <p>Đang tải tài liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-page">
        <h1>Lỗi</h1>
        <p>{error}</p>
        <Link to={`/chapter/${chapterId}`} className="back-link">
          ← Quay lại
        </Link>
      </div>
    )
  }

  return (
    <div className="document-viewer">
      <header className="viewer-header">
        <Link to={`/chapter/${chapterId}`} className="back-btn">
          ← Quay lại
        </Link>
        <div className="doc-title-section">
          <span className="doc-icon-large">{doc?.icon}</span>
          <h1>{doc?.title}</h1>
        </div>
      </header>

      <main className="viewer-content">
        <article className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              table({ children }) {
                return (
                  <div className="table-wrapper">
                    <table>{children}</table>
                  </div>
                )
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>

      <button 
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Lên đầu trang"
      >
        ↑
      </button>
    </div>
  )
}

export default DocumentViewer
