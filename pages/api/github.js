import fetch from 'isomorphic-unfetch'
export default async (req, res) => {
  const resp = await fetch('https://loripsum.net/api')
  const result = await resp.text()
  console.log('resp', result)
  res.end(result)
}
