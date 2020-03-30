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

type ClassName = {
  [string]: any,
}

export type ClassNames = {
  container: ClassName | null,
  containerRaised: ClassName | null,
  message: ClassName | null,
  icon: ClassName | null,
}
