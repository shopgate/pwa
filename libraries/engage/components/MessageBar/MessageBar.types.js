// @flow

export type Message = {
  message: string,
  type: string,
}

export type ClassName = {
  [string]: any,
}

export type ClassNames = {
  container: ClassName | null,
  message: ClassName | null,
  icon: ClassName | null,
}
