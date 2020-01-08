export class Post {
  static async create(post) {
    const token =
      JSON.parse(localStorage.getItem('epp-mini-blog/auth')).token || null
    const res = await fetch(
      `https://mini-blog-d70e8.firebaseio.com/posts.json?auth=${token}`,
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
    Post.renderList()
    return post
  }

  static async renderList() {
    // if online, get post from firebase, else from local storage
    let allPosts
    if (navigator.onLine) {
      allPosts = await Post.fetch()
      localStorage.setItem('epp-mini-blog/posts', JSON.stringify(allPosts))
    } else {
      allPosts = JSON.parse(localStorage.getItem('epp-mini-blog/posts') || '[]')
    }

    const html = allPosts.length
      ? allPosts.map(toCard).join('')
      : `<div class="mui--text-headline">Лента не загрузилась. Возможно, проблемы с сетью?</div>`

    const list = document.getElementById('posts-list')
    list.innerHTML = html
  }

  static async fetch() {
    const res = await fetch(`https://mini-blog-d70e8.firebaseio.com/posts.json`)
    const data = await res.json()

    if (data && data.error) {
      return Promise.resolve(`<p class="error">${data.error}</p>`)
    }
    return data ? Object.keys(data).map(id => ({ ...data[id], id })) : []
  }
}

function toCard(post) {
  return `
    <div class="post">
        <div class="mui--text-headline post__title">${post.title}</div>
            <div class="mui--text-dark-secondary post__date">
                @${post.author}
            </div>
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
