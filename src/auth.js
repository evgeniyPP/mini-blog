export function getAuthFormHTML() {
  return `
    <form class="mui-form" id="auth__form">
        <div class="mui-textfield mui-textfield--float-label">
            <input type="email" id="auth__email" required>
            <label for="auth__email">E-mail</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
            <input type="password" id="auth__password" required>
            <label for="auth__password">Пароль</label>
        </div>
        <button type="submit" class="mui-btn mui-btn--raised">Войти</button>
    </form>
    `
}

export async function authWithEmailAndPassword(email, password) {
  const API_KEY = 'AIzaSyDUQwGPhzA2Pq3ZNLhaMZdy3bZ5_N01DZw'
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  const data = await res.json()
  return data.idToken
}
