export default async () => {
  let queryString = window.location.search
  let urlParams = new URLSearchParams(queryString)
  let APP_SID = urlParams.get('APP_SID')
  let tokensString:any = await $fetch('/api/getAuth', {
    method: 'post',
    body: JSON.stringify({
      APP_SID,
    }),
  })
  let tokens = {
    refresh_token: tokensString.REFRESH_ID,
    expires_in: Number(tokensString.AUTH_EXPIRES),
    access_token: tokensString.AUTH_ID,
    member_id: tokensString.member_id,
    domain: tokensString.domain,
  }
  return tokens
}
