let I18nHelper = {
  locale: function () {
    let locale = VueHelper.getLocalStorage('ConfigManager.locale', ConfigHelper.get('locale'))
    if (locale === 'auto') {
      locale = navigator.language || navigator.userLanguage
    }
    return locale
  }
}
window.I18nHelper = I18nHelper
export default I18nHelper