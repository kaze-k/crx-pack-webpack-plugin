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
