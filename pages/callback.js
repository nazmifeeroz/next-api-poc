import React from 'react'
import fetch from 'isomorphic-unfetch'

const CallbackPage = ({ code }) => <div>callback page: {code}</div>

CallbackPage.getInitialProps = ({ query }) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ code: query.code }),
  }
  fetch(`${process.env.APP_URL}/api/github`, options).then(async response => {
    const result = await response.json()
    console.log('result', result)
  })
  return { code: query.code }
}

export default CallbackPage
