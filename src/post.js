export class Post {
  static async create(post) {
    const res = await fetch(
      'https://mini-blog-d70e8.firebaseio.com/posts.json',
      {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const data = await res.json()
    post.id = data.name
    addToLocalStorage(post)
    Post.renderList()
    return post
  }

  static renderList() {
    const allPosts = getPostsFromLocalStorage()

    const html = allPosts.length
      ? allPosts.map(toCard).join('')
      : `<div class="mui--text-headline">У Вас нет постов. Создайте один!</div>`

    const list = document.getElementById('posts-list')
    list.innerHTML = html
  }

  static async fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">Неудача, попробуйте еще раз</p>')
    }
    const res = await fetch(
      `https://mini-blog-d70e8.firebaseio.com/posts.json?auth=${token}`
    )
    const data = await res.json()
    if (data && data.error) {
      return Promise.resolve(`<p class="error">${data.error}</p>`)
    }
    return data ? Object.keys(data).map(id => ({ ...data[id], id })) : []
  }

  static listToHTML(posts) {
    return posts.length
      ? `
        <ul class="modal__post-list">
            ${posts.map(post => toCard(post)).join('')}
        </ul>
        `
      : `<p>Постов пока нет</p>`
  }
}

function addToLocalStorage(post) {
  const allPosts = getPostsFromLocalStorage()
  allPosts.push(post)
  localStorage.setItem('epp-mini-blog/posts', JSON.stringify(allPosts))
}

function getPostsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('epp-mini-blog/posts') || '[]')
}

function toCard(post) {
  return `
    <div class="post">
        <div class="mui--text-headline post__title">${post.title}</div>
            <div class="mui--text-dark-secondary post__date">
                ${new Date(post.date).toLocaleDateString()}
                ${new Date(post.date).toLocaleTimeString()}
            </div>
            <div class="post__text">
                ${post.text}
            </div>
    </div>
    `
}
