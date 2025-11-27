

export const getDateOnTimeZone = (date: Date | string | number, timezone: number): Date =>
  new Date(new Date(date).setHours(new Date(date).getHours() + timezone));


export const formatDistanceToNowStrictDate = (date: Date): Date => getDateOnTimeZone(date, new Date().getTimezoneOffset() / -60)
