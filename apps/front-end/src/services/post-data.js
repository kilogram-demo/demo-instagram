import fetching from './basic-fetch'

export async function createPost(newPostData) {
    return fetchInit({ method: 'POST', data: newPostData })
}

export async function getPost(postId) {
    const path = `/${postId}`
    return fetchInit({ path })
}

export async function updatePost(postId, updateData) {
    const path = `/${postId}`
    return fetchInit({ path, method: 'PUT', data: updateData })
}

export async function deletePost(postId) {
    const path = `/${postId}`
    return fetchInit({ path, method: 'DELETE' })
}

export async function toggleLikePost(postId) {
    const path = `/${postId}/like`
    return fetchInit({ path, method: 'PUT' })
}

export function getPostLikes(postId, skip = 0, limit = 10) {
    const path = `/${postId}/likes?skip=${skip}&limit=${limit}`
    return fetchInit({ path })
}

export function savePost(postId) {
    const path = `/${postId}/save`
    fetchInit({ path, method: 'PUT' })
}

export async function getImageLink(image) {
    return fetch('/api/upload', {
        method: 'POST',
        headers: {
            contentType: 'multipart/form-data',
        },
        body: image,
    }).then((res) => {
        if (res.statusCode === 401) {
            store.dispatch(setIsUser(false))
            window.location.pathname = '/'
            throw new Error('You`r not Logged in yet')
        }
        return res.json()
    })
}

async function fetchInit({ path = '', method = 'GET', data = null }) {
    path = `/api/posts${path}`
    return await fetching({ path, method, data })
}
