// @flow
export type Message = {
  message: string,
  type?: string,
  messageParams?: {
    [string]: any,
  } | null,
  translated?: boolean,
  icon?: any | null,
}

export type ClassNames = {
  container: string | null,
  containerRaised: string | null,
  message: string | null,
  icon: string | null,
}
