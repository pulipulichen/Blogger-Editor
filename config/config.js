const CONFIG = {
  locale: 'auto',
  localeOptions: ['auto', 'en-US', 'zh-TW'],
  defaultTheme: 'default',
  uploadImageDraft: '',
  quotaInMB: 100,
  enableOCRMemoryThresholdMB: 40,
  scrollUpShowMenu: false,
  showReload: false,
  debug: {
    //disablePostManager: true,
    disableThemeManager: false,
    disableEditorManager: false,
    disableConfigManager: false,
    disablePublishManager: false,
    
    disableSummerNode: false,
    
    disableImageReplacer: false,
    disableTemplateBuilder: false,
    disableIframePrompt: false,
    disableFileUploader: false,
    disableCodeInserter: false,
    disableOutlineNavigator: false,
    disableSnippetInserter: false,
    disableSaveIndicator: false,
    disableGoogleDocLinkBuilder: false,
  },
  FileUploader: {
    links: [
      {
        name: 'GitHub',
        uploadURL: 'https://github.com/',
      },
      {
        name: 'Google Drive',
        uploadURL: 'https://drive.google.com/drive/u/0/'
      },
      {
        name: 'One Drive',
        uploadURL: 'https://onedrive.live.com'
      },
      {
        name: 'Mega',
        uploadURL: 'https://mega.nz/'
      },
      {
        name: 'Box',
        uploadURL: 'https://app.box.com/folder/0'
      },
      {
        name: 'MediaFire',
        uploadURL: 'http://www.mediafire.com/myfiles.php'
      },
      {
        name: 'SlideShare',
        uploadURL: 'https://slideshare.net/upload'
      },
      {
        name: 'Uguu.se',
        uploadURL: 'https://uguu.se/'
      }
    ]
  }
}
export default CONFIG
  
// chrome://settings/cookies/detail?site=localhost