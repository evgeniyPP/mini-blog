import { isValid, createModal, closeModal, createModalError } from './utils'
import { Post } from './post'
import { getAuthFormHTML, logIn, signUp } from './auth'
import './styles'
import './favicon.ico'

const newPostForm = document.getElementById('new-post__form')
const title = newPostForm.querySelector('#new-post__title')
const text = newPostForm.querySelector('#new-post__text')
const submit = newPostForm.querySelector('#new-post__submit')
const loginBtn = document.getElementById('login-btn')

newPostForm.addEventListener('submit', handleNewPostForm)
title.addEventListener('input', handleInput)
text.addEventListener('input', handleInput)
window.addEventListener('load', Post.renderList)

const authData = JSON.parse(localStorage.getItem('epp-mini-blog/auth')) || []

const expirationDate = authData.expirationDate || null
if (Date.now() - expirationDate >= 3600000 || expirationDate === null) {
  localStorage.removeItem('epp-mini-blog/auth')
  loginBtn.addEventListener('click', handleLogin)
} else {
  loginBtn.innerText = 'Выйти'
  loginBtn.addEventListener('click', handleLogout)
}

async function handleNewPostForm(e) {
  e.preventDefault()
  const token = authData.token || null
  const author = authData.author || null
  if (
    token &&
    author &&
    isValid(title.value.trim(), 5, 30) &&
    isValid(text.value.trim(), 30, 256)
  ) {
    const post = {
      author,
      title: title.value.trim(),
      text: text.value.trim(),
      date: new Date().toJSON()
    }

    submit.disabled = true
    await Post.create(post)
    title.value = ''
    title.className = ''
    text.value = ''
    text.className = ''
  }
}

function handleInput() {
  submit.disabled =
    !isValid(title.value.trim(), 5, 30) || !isValid(text.value.trim(), 30, 256)
}

function handleLogin() {
  createModal('Авторизация', getAuthFormHTML())
  const login = document.getElementById('auth__login')
  const password = document.getElementById('auth__password')
  const loginBtn = document.getElementById('login')
  const signupBtn = document.getElementById('signup')

  const checkInput = () => {
    if (
      isValid(login.value.trim(), 3, 15) &&
      isValid(password.value.trim(), 5, 30)
    ) {
      loginBtn.disabled = false
      signupBtn.disabled = false
    } else {
      loginBtn.disabled = true
      signupBtn.disabled = true
    }
  }

  login.addEventListener('input', checkInput)
  password.addEventListener('input', checkInput)

  loginBtn.addEventListener('click', authFormHandler, { once: true })
  signupBtn.addEventListener('click', authFormHandler, { once: true })
}

function handleLogout() {
  localStorage.removeItem('epp-mini-blog/auth')
  loginBtn.innerText = 'Войти'
  loginBtn.removeEventListener('click', handleLogout)
  loginBtn.addEventListener('click', handleLogin)
}

async function authFormHandler(e) {
  e.preventDefault()
  const email =
    e.target.form.querySelector('#auth__login').value + '@nomail.com'
  const password = e.target.form.querySelector('#auth__password').value
  const loginbutton = e.target.form.querySelector('#login')
  const signupbutton = e.target.form.querySelector('#signup')

  loginbutton.disabled = true
  signupbutton.disabled = true
  const data =
    e.target.id === 'login'
      ? await logIn(email, password)
      : await signUp(email, password)
  if (data && data.error) {
    switch (data.error.message) {
      case 'EMAIL_NOT_FOUND':
        createModalError('Пользователь с таким e-mail не найден')
        break
      case 'EMAIL_EXISTS':
        createModalError('Пользователь с таким e-mail уже существует')
        break
      default:
        createModalError('Неизвестная ошибка')
        break
    }
  } else {
    await Post.renderList()
    closeModal()
    loginBtn.innerText = 'Выйти'
    loginBtn.removeEventListener('click', handleLogin)
    loginBtn.addEventListener('click', handleLogout)
  }
  loginbutton.disabled = false
  signupbutton.disabled = false
}
