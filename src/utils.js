export function isValid(value, min, max) {
  return value.length >= min && value.length <= max
}

export function createModal(title, content) {
  const modal = document.createElement('div')
  modal.classList.add('modal')

  modal.innerHTML = `
    <h1 class="modal__title">${title}</h1>
    <div class="modal__content">${content}</div>
  `

  mui.overlay('on', modal)
}
