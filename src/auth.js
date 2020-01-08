export function getAuthFormHTML() {
  return `
    <form class="mui-form" id="auth__form">
        <div class="mui-textfield mui-textfield--float-label">
            <input type="text" id="auth__login" required minlength="3" maxlength="15">
            <label for="auth__login">Логин</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
            <input type="password" id="auth__password" required>
            <label for="auth__password">Пароль</label>
        </div>
        <button type="submit" id="login" class="mui-btn mui-btn--raised" disabled>Войти</button>
        <button type="submit" id="signup" class="mui-btn mui-btn--raised btn-blue" disabled>Зарегистрироваться</button>
    </form>
    `
}

export async function logIn(email, password) {
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
  setLocalStorage(data)
  return data
}

export async function signUp(email, password) {
  const API_KEY = 'AIzaSyDUQwGPhzA2Pq3ZNLhaMZdy3bZ5_N01DZw'
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  const data = await res.json()
  setLocalStorage(data)
  return data
}

function setLocalStorage(data) {
  if (data.idToken) {
    localStorage.setItem(
      'epp-mini-blog/auth',
      JSON.stringify({
        token: data.idToken,
        author: data.email.replace(/@.*$/i, ''),
        expirationDate: Date.now()
      })
    )
  }
}
