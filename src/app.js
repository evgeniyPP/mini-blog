import { isValid, createModal } from './utils'
import { Post } from './post'
import { getAuthFormHTML, authWithEmailAndPassword } from './auth'
import './styles'

const form = document.getElementById('new-post__form')
const title = form.querySelector('#new-post__title')
const text = form.querySelector('#new-post__text')
const submit = form.querySelector('#new-post__submit')
const modalBtn = document.getElementById('modal-btn')

form.addEventListener('submit', handleForm)
title.addEventListener('input', handleInput)
text.addEventListener('input', handleInput)
window.addEventListener('load', Post.renderList)
modalBtn.addEventListener('click', openModal)

async function handleForm(e) {
  e.preventDefault()
  if (
    isValid(title.value.trim(), 5, 30) &&
    isValid(text.value.trim(), 30, 256)
  ) {
    const post = {
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

function openModal() {
  createModal('Необходимо авторизоваться', getAuthFormHTML())
  document
    .getElementById('auth__form')
    .addEventListener('submit', authFormHandler, { once: true })
}

async function authFormHandler(e) {
  e.preventDefault()
  const email = e.target.querySelector('#auth__email').value
  const password = e.target.querySelector('#auth__password').value
  const button = e.target.querySelector('button')

  button.disabled = true
  const token = await authWithEmailAndPassword(email, password)
  const data = await Post.fetch(token)
  renderModalAfterAuth(data)
  button.disabled = false
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    createModal('Возникла ошибка', content)
  } else {
    createModal('Все посты', Post.listToHTML(content))
  }
}
