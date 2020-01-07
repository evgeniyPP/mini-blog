import { isValid, createModal, closeModal } from './utils'
import { Post } from './post'
import { getAuthFormHTML, logIn, signUp } from './auth'
import './styles'

const form = document.getElementById('new-post__form')
const title = form.querySelector('#new-post__title')
const text = form.querySelector('#new-post__text')
const submit = form.querySelector('#new-post__submit')
const modalBtn = document.getElementById('login-btn')

form.addEventListener('submit', handleForm)
title.addEventListener('input', handleInput)
text.addEventListener('input', handleInput)
window.addEventListener('load', Post.renderList)
modalBtn.addEventListener('click', openModal)

async function handleForm(e) {
  e.preventDefault()
  const token = localStorage.getItem('epp-mini-blog/token')
  if (
    token &&
    isValid(title.value.trim(), 5, 30) &&
    isValid(text.value.trim(), 30, 256)
  ) {
    const post = {
      author: localStorage.getItem('epp-mini-blog/author'),
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
    submit.disabled = false
  }
}

function handleInput() {
  submit.disabled =
    !isValid(title.value.trim(), 5, 30) || !isValid(text.value.trim(), 30, 256)
}

async function openModal() {
  const token = localStorage.getItem('epp-mini-blog/token')
  if (token) {
    return createModal('Вы уже вошли, хотите перезайти?', getAuthFormHTML())
  }

  createModal('Необходимо авторизоваться', getAuthFormHTML())
  document
    .getElementById('login')
    .addEventListener('click', authFormHandler, { once: true })
  document
    .getElementById('signup')
    .addEventListener('click', authFormHandler, { once: true })
}

async function authFormHandler(e) {
  e.preventDefault()
  const email = e.target.form.querySelector('#auth__email').value
  const password = e.target.form.querySelector('#auth__password').value
  const loginbutton = e.target.form.querySelector('#login')
  const signupbutton = e.target.form.querySelector('#signup')

  loginbutton.disabled = true
  signupbutton.disabled = true
  const token =
    e.target.id === 'login'
      ? await logIn(email, password)
      : await signUp(email, password)
  const data = await Post.fetch(token)
  if (typeof data === 'string') {
    createModal('Возникла ошибка', data)
  } else {
    await Post.renderList()
    closeModal()
  }
  loginbutton.disabled = false
  signupbutton.disabled = false
}
