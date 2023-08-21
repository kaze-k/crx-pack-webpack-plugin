declare module "crx3" {
  const crx3: (
    manifest: string[],
    settings: {
      keyPath: string
      zipPath?: string
      xmlPath?: string
      crxPath: string
      crxURL?: string
    },
  ) => Promise<void>
  export default crx3
}

declare module "colors-console" {
  const colors_console: (color: string, message: string) => void

  export default colors_console
}