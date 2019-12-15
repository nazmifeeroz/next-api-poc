import React, { useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

const CallbackPage = props => {
  useEffect(() => {
    // TODO: this is not right as the props are passed as url queries
    Router.push({
      pathname: '/',
      query: props,
    })
  }, [])

  return <div>callback page: </div>
}

CallbackPage.getInitialProps = ({ query }) => {
  const options = {
    method: 'POST',
    body: JSON.stringify({ code: query.code }),
  }
  return fetch(
    `${process.env.APP_URL}/api/github`,
    options
  ).then(async response => response.json())
}

export default CallbackPage
