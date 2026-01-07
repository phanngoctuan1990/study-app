import { useState, useEffect } from 'react'
import { isWebAuthnSupported, getStoredPasskey, authenticateWithPasskey, verifyActivationCode, registerPasskey } from '../utils/webauthn'

function Login({ onLogin }) {
  const [activationCode, setActivationCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasPasskey, setHasPasskey] = useState(false)
  const [webAuthnSupported, setWebAuthnSupported] = useState(false)

  useEffect(() => {
    setWebAuthnSupported(isWebAuthnSupported())
    setHasPasskey(!!getStoredPasskey())
  }, [])

  const handleFaceIDLogin = async () => {
    setError('')
    setIsLoading(true)
    try {
      const success = await authenticateWithPasskey()
      if (success) onLogin()
      else setError('Không thể xác thực')
    } catch (err) {
      setError('Lỗi FaceID: ' + err.message)
    }
    setIsLoading(false)
  }

  const handleActivate = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const valid = await verifyActivationCode(activationCode)
      if (!valid) {
        setError('Mã kích hoạt không đúng')
        setIsLoading(false)
        return
      }
      await registerPasskey()
      onLogin()
    } catch (err) {
      setError('Lỗi: ' + err.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📚</span>
          <h1>Study Review</h1>
          <p>Ôn luyện System Design mọi lúc mọi nơi</p>
        </div>

        {hasPasskey ? (
          <div className="faceid-section">
            <button onClick={handleFaceIDLogin} className="faceid-btn" disabled={isLoading}>
              🔐 Đăng nhập bằng FaceID
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : webAuthnSupported ? (
          <form onSubmit={handleActivate} className="login-form">
            <div className="form-group">
              <label htmlFor="activation">Mã kích hoạt</label>
              <input
                id="activation"
                type="password"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="Nhập mã kích hoạt"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : '🔐 Kích hoạt & Thiết lập FaceID'}
            </button>
          </form>
        ) : (
          <div className="error-message">
            Thiết bị không hỗ trợ FaceID/TouchID. Vui lòng sử dụng Safari trên iPhone/iPad.
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
