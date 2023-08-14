declare module "crx3" {
  const crx3: (
    manifest: string[],
    settings: {
      keyPath: string
      crxPath: string
    },
  ) => Promise<void>
  export default crx3
}
