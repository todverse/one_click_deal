const sleep = (milliseconds:any) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export default defineEventHandler(async (event) => {
  let a = getRequestURL(event).toString()
  if (a.includes('/?DOMAIN=')) {
    let body = await readBody(event)
    let domain = a.split('&')[0].split('=')[1]
    let appsid = a.split('APP_SID=')[1]
    body.domain = domain
    const auth = JSON.stringify(body)
    await useStorage().setItem(appsid, auth, { ttl: body.AUTH_EXPIRES })
    let data = await useStorage().getItem(appsid)
    let count = 0
    while(data == null) {
      await useStorage().setItem(appsid, auth, { ttl: body.AUTH_EXPIRES })
      await sleep(500)
      data = await useStorage().getItem(appsid)
      count++
      if(count == 10) data = {}
    }
  }
})
