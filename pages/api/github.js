import fetch from 'isomorphic-unfetch'

const getGithubUserAccessToken = code => {
  const data = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  }

  const options = {
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  }
  return fetch(options.url, options)
    .then(async response => {
      const result = await response.json()
      return result
    })
    .catch(err => console.log('err', err))
}

export default async (req, res) => {
  const { body, method } = req

  switch (method) {
    case 'POST': {
      const { code } = JSON.parse(body)
      const result = await getGithubUserAccessToken(code)
      res.status(200).end(JSON.stringify(result))
    }

    default:
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
