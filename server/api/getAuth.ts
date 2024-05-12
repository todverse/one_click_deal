const sleep = (milliseconds:any) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export default defineEventHandler(async (event) => {
  let body = await readBody(event)
  let appsid = body.APP_SID
  let data = await useStorage().getItem(appsid)
  let count = 0
  while(data == null) {
    await sleep(1000)
    data = await useStorage().getItem(appsid)
    count++
    if(count == 10) data = {}
  }
  return data
})
