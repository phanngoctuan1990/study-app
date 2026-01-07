const STORAGE_KEY = 'studyapp_passkey'
const ACTIVATION_HASH = '59538ae4faa4f7dfaeb815901a6f0c7af9c15a6e0a850544fa7ba13bc8bd31f2'

export const isWebAuthnSupported = () => 
  !!(window.PublicKeyCredential && navigator.credentials)

export const getStoredPasskey = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

export const verifyActivationCode = async (code) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(code)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex === ACTIVATION_HASH
}

export const registerPasskey = async () => {
  const challenge = crypto.getRandomValues(new Uint8Array(32))
  const userId = crypto.getRandomValues(new Uint8Array(16))

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'Study App', id: window.location.hostname },
      user: { id: userId, name: 'user', displayName: 'Study User' },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
      timeout: 60000
    }
  })

  const passkey = {
    credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
    activated: true
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passkey))
  return passkey
}

export const authenticateWithPasskey = async () => {
  const stored = getStoredPasskey()
  if (!stored) return false

  const credentialId = Uint8Array.from(atob(stored.credentialId), c => c.charCodeAt(0))
  const challenge = crypto.getRandomValues(new Uint8Array(32))

  await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [{ id: credentialId, type: 'public-key' }],
      userVerification: 'required',
      timeout: 60000
    }
  })

  return true
}
