# crx-pack-webpack-plugin

A webpack5 plugin to pack crx, use [crx3](https://github.com/ahwayakchih/crx3) and support typescript.

## Usage

add the plugin:

``` js
yarn add crx-pack-webpack-plugin -D
```

configure the plugin:

``` js
new CrxPackWebpackPlugin({
  zip: true,
  xml: true,
  keyFile: "your-private-key.pem",
  contentPath: "./build",
  outputPath: "./release",
  updateURL: "http://localhost:8080",
  updateFilename: "update.xml",
  name: "example-name",
  autoClean: true,
})
```

## Configuration Settings

| Option | Required | Type | Default | About |
|---|---|---|---|---|
| zip | no | boolean | true | provides a zip of the build files along with the CRX. |
| xml | no | boolean | true | provides a xml of the build files along with the CRX. |
| keyFile | yes | string | none | a private key required to update the extension. |
| contenPath | yes | string | none | location of build files. |
| outputPath | yes | string | none | where to export the built extension. |
| updateURL | no | string | "http://localhost:8000/" | where to find updates.xml |
| updateFilename | no | string | "update.xml" | filename for update.xml |
| name | no | string | "package" | the name of the built extension. |
| autoClean | no | boolean | false | whether to automatically empty files |

## Alternatives

- [crx-webpack-plugin](https://github.com/johnagan/crx-webpack-plugin)
- [crx3-webpack-plugin](https://github.com/garrettlr/crx3-webpack-plugin)

Thank them for their inspiration
