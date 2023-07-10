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
    disableMarkdownImporter: false,
    disableOutlineNavigator: false,
    disableSnippetInserter: false,
    disableSaveIndicator: false,
    disableGoogleDocLinkBuilder: false,
  },
  FileUploader: {
    links: [
      {
        name: 'Google Drive',
        uploadURL: 'https://drive.google.com/drive/u/0/',
        parameters: 'pptx'
      },
      {
        name: 'SlideShare',
        uploadURL: 'https://slideshare.net/upload',
        parameters: ''
      },
      {
        name: 'GitHub',
        uploadURL: 'https://github.com/',
        parameters: 'https://pulipulichen.github.io/blog-pulipuli-info-data-2020-2025/{YY}/{MM}/'
      },
      {
        name: 'One Drive',
        uploadURL: 'https://onedrive.live.com',
        parameters: ''
      },
      {
        name: 'Mega',
        uploadURL: 'https://mega.nz/',
        parameters: ''
      },
      {
        name: 'Box',
        uploadURL: 'https://app.box.com/folder/0',
        parameters: ''
      },
      {
        name: 'MediaFire',
        uploadURL: 'http://www.mediafire.com/myfiles.php',
        parameters: ''
      },
      {
        name: 'pCloud',
        uploadURL: 'https://my.pcloud.com/',
        parameters: ''
      },
      // {
      //   name: 'sync.com',
      //   uploadURL: 'https://cp.sync.com/',
      //   parameters: ''
      // },
      // {
      //   name: 'icdedrive',
      //   uploadURL: 'https://icedrive.net/dashboard/#/cloud/',
      //   parameters: ''
      // },
      {
        name: 'Degoo',
        uploadURL: 'https://app.degoo.com/',
        parameters: ''
      },
      // {
      //   // 只有48小時，還是不要用吧
      //   name: 'Uguu.se',
      //   uploadURL: 'https://uguu.se/'
      // }
    ],
    downloadTemplate: `<ul>
    <li>檔案備份：{DOWNLOADS}</li>
  </ul>`,
    downloadTemplateSlide: `<p><a href="{THUMBNAIL_URL}" target="_blank">{THUMBNAIL_URL}</a></p>
  <ul>
    <li><a href="{GOOGLE_SLIDE}" target="_blank">Google簡報線上檢視</a></li>
    <li><a href="{GOOGLE_SLIDE_PDF}" target="_blank">PDF格式下載</a></li>
    <li>Power Point (.pptx) 格式備份：{DOWNLOADS}</li>
  </ul>`,
    downloadTemplateDoc: `<p><a href="{THUMBNAIL_URL}" target="_blank">{THUMBNAIL_URL}</a></p>
  <ul>
    <li><a href="{GOOGLE_DOC}" target="_blank">Google文件線上檢視</a></li>
    <li><a href="{GOOGLE_DOC_PDF}" target="_blank">PDF格式下載</a></li>
    <li>OpenDocument Text (.odt) 格式備份：{DOWNLOADS}</li>
  </ul>`,
    downloadTemplateSheet: `<p><a href="{THUMBNAIL_URL}" target="_blank">{THUMBNAIL_URL}</a></p>
  <ul>
    <li><a href="{GOOGLE_SHEET}" target="_blank">Google試算表線上檢視</a></li>
    <li><a href="{GOOGLE_SHEET_ODS}" target="_blank">ODS格式下載</a></li>
    <li>OpenDoucment Spreadsheet (.ods) 格式備份：{DOWNLOADS}</li>
  </ul>`,
    delimiter: '、' //sdsd
  }
}
export default CONFIG
  
// chrome://settings/cookies/detail?site=localhost