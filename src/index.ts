import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from "fs"
import { join } from "path"
import { mkdirp } from "mkdirp"
import crx from "crx3"
import { Compiler, Compilation } from "webpack"
import colors from "colors-console"

const MANIFEST = "manifest.json"
const NAME = "package"
const UPDATE_URL = "http://localhost:8000/"
const UPDATE_FILENAME = "update.xml"

interface Options {
  zip?: boolean
  xml?: boolean
  keyFile: string
  contentPath: string
  outputPath: string
  updateURL?: string
  updateFilename?: string
  name?: string
}

interface Settings {
  keyPath: string
  zipPath?: string
  xmlPath?: string
  crxPath: string
  crxURL?: string
}

class Plugin {
  public options: Options
  public zip: boolean
  public xml: boolean
  public keyFile: string
  public contentPath: string
  public outputPath: string
  public name: string
  public crxName: string
  public zipName: string
  public manifest: string
  public crxFile: string
  public zipFile: string
  public updateFile: string
  public updateURL: string
  public logger: ReturnType<Compilation["getLogger"]>

  constructor(options: Options) {
    this.options = options

    if (!this.options.name) {
      this.options.name = NAME
    }

    if (!this.options.updateURL) {
      this.options.updateURL = UPDATE_URL
    }

    if (!this.options.updateFilename) {
      if (this.options.name) {
        this.options.updateFilename = `${this.options.name}.xml`
      } else {
        this.options.updateFilename = UPDATE_FILENAME
      }
    }

    if (typeof this.options.zip === "undefined") {
      this.options.zip = true
    }

    if (typeof this.options.xml === "undefined") {
      this.options.xml = true
    }

    this.zip = !!this.options.zip
    this.xml = !!this.options.xml

    this.options.updateURL = this.options.updateURL.replace(/\/$/, "")

    this.keyFile = this.options.keyFile
    this.contentPath = this.options.contentPath
    this.outputPath = this.options.outputPath
    this.name = this.options.name

    this.crxName = `${this.options.name}.crx`
    this.zipName = `${this.options.name}.zip`

    this.manifest = join(this.contentPath, MANIFEST)
    this.crxFile = join(this.outputPath, this.crxName)
    this.zipFile = join(this.outputPath, this.zipName)
    this.updateFile = join(this.outputPath, this.options.updateFilename)
    this.updateURL = `${this.options.updateURL}/${this.crxName}`
  }

  public apply(compiler: Compiler): void {
    this.logger = compiler.getInfrastructureLogger("crx-webpack-plugin")

    compiler.hooks.make.tap("crx-webpack-plguin", (): void => {
      this.clean(this.outputPath)
    })

    compiler.hooks.emit.tap("crx-webpack-plugin", (): void => {
      this.init()
    })

    compiler.hooks.done.tap("crx-webpack-plugin", (): void => {
      this.pack()
    })
  }

  private init(): void {
    mkdirp(this.outputPath).catch((err: Error): void => this.logger.error(err))
  }

  private clean(dirPath: string): void {
    if (existsSync(dirPath)) {
      const files: string[] = readdirSync(dirPath)
      files.forEach((file: string): void => {
        const curPath = join(dirPath, file)

        if (lstatSync(curPath).isDirectory()) {
          this.clean(curPath)
          rmdirSync(curPath)
        } else {
          unlinkSync(curPath)
        }
      })
    }
  }

  private handleSettings(settings: Settings): Settings {
    const { zip, xml } = this.options

    if (zip) {
      settings.zipPath = this.zipFile
    }

    if (xml) {
      settings.xmlPath = this.updateFile
      settings.crxURL = this.updateURL
    }

    return settings
  }

  private pack(): void {
    const settings: Settings = {
      keyPath: this.keyFile,
      crxPath: this.crxFile,
    }

    this.handleSettings(settings)

    crx([this.manifest], settings)
      .then((): void => {
        if (settings.crxPath) {
          console.log(`${colors("cyan", this.contentPath)} -> ${colors("green", settings.crxPath)}`)
        }

        if (settings.zipPath) {
          console.log(`${colors("cyan", this.contentPath)} -> ${colors("green", settings.zipPath)}`)
        }

        if (settings.xmlPath) {
          console.log(`${colors("cyan", this.contentPath)} -> ${colors("green", settings.xmlPath)}`)
        }
      })
      .catch((err: Error): void => this.logger.error(err))
  }
}

export default Plugin
