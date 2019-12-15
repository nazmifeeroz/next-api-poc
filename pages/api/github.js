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
      /**
        result {
          access_token: <ACCESS_TOKEN>,
          token_type: 'bearer',
          scope: 'read:org'
        }
       */
      return result
    })
    .catch(err => console.log('err', err))
}

const checkUserMembership = access_token => {
  const options = {
    method: 'GET',
    url: `https://api.github.com/orgs/${process.env.ORGANISATION}/members`,
    headers: {
      'User-Agent': `${process.env.APP_NAME}`,
      Authorization: `token ${access_token}`,
    },
  }
  return new Promise((resolve, _reject) => {
    fetch(options.url, options)
      .then(response => response.json())
      .then(body => resolve(body))
  })
}

const authenticateGithubUser = async code => {
  const { access_token } = await getGithubUserAccessToken(code)
  if (!access_token) return { error: 'no access token' }

  const orgMembers = await checkUserMembership(access_token)
  console.log('orgMembers', orgMembers)

  const isMember = Array.isArray(orgMembers) && orgMembers.length > 0

  return { isMember }
}

export default async (req, res) => {
  const { body, method } = req

  switch (method) {
    case 'POST': {
      const { code } = JSON.parse(body)
      const result = await authenticateGithubUser(code)
      res.status(200).end(JSON.stringify(result))
    }

    default:
      res
        .status(405)
        .end(JSON.stringify({ error: `Method ${method} Not Allowed` }))
  }
}
