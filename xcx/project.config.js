module.exports = {
  miniprogramRoot: 'dist/',
  projectname: 'xcx-app',
  description: 'AI命理大师',
  appid: '', // 请填写你的小程序 appid
  setting: {
    urlCheck: true,
    es6: false,
    enhance: true,
    postcss: true,
    preloadBackgroundData: false,
    minified: true,
    newFeature: false,
    coverView: true,
    nodeModules: false,
    autoAudits: false,
    showShadowRootInWxmlPanel: true,
    scopeDataCheck: false,
    uglifyFileName: false,
    checkInvalidKey: true,
    checkSiteMap: true,
    uploadWithSourceMap: true,
    compileHotReLoad: false,
    lazyloadPlaceholderEnable: false,
    useMultiFrameRuntime: true,
    useApiHook: true,
    useApiHostProcess: true,
    babelSetting: {
      ignore: [],
      disablePlugins: [],
      outputPath: ''
    },
    enableEngineNative: false,
    useIsolateContext: true,
    userConfirmedBundleSwitch: false,
    packNpmManually: false,
    packNpmRelationList: [],
    minifyWXSS: true,
    disableUseStrict: false,
    minifyWXML: true,
    showES6CompileOption: false,
    useCompilerPlugins: false,
    ignoreUploadUnusedFiles: true
  },
  compileType: 'miniprogram',
  libVersion: '',
  simulatorType: 'wechat',
  simulatorPluginLibVersion: '',
  condition: {},
  editorSetting: {
    tabIndent: 'insertSpaces',
    tabSize: 2
  }
}