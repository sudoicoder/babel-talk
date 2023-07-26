import type { FunctionComponent, ReactNode } from "react"

export type FC<Props = {}> = FunctionComponent<Props & { children?: ReactNode }>

export type optional<T> = T | null
