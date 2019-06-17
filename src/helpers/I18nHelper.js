let I18nHelper = {
  locale: function () {
    let locale = VueHelper.getLocalStorage('ConfigManager.locale', ConfigHelper.get('locale'))
    if (locale === 'auto') {
      if (typeof(ElectronSettings) === 'object' && typeof(ElectronSettings.language) === 'string') {
        locale = ElectronSettings.language
      }
      else {
        locale = navigator.language || navigator.userLanguage
      }
      console.log(locale)
    }
    return locale
  }
}
window.I18nHelper = I18nHelper
export default I18nHelper