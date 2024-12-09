export const switchLanguage = (lang: string, pathname: string, queryString: string) => {
  const parts = pathname.split('/').filter((part) => part)

  if (parts[0] === 'vi' || parts[0] === 'en') {
    parts[0] = lang
  } else {
    parts.unshift(lang)
  }

  return queryString ? `/${parts.join('/')}` + `?${queryString}` : `/${parts.join('/')}`
}
