export default async function fetching({
    path = '',
    method = 'GET',
    data = null,
}) {
    path = `${path}`
    const options = {
        method: method,
        headers: new Headers({
            'user-id': '0',
        }),
    }
    if (!!data && Object.keys(data).length) {
        options.headers.append('Content-Type', 'application/json')
        options.body = JSON.stringify(data)
    }

    return fetch(path, options)
        .then((res) => res.json())
        .catch((err) => console.log('ERROR: ' + err))
}
