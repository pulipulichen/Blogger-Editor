/* global DayjsHelper, GoogleAnalyticsHelper, DelayExecHelper, EventManager, WindowHelper */

let NavBarMenu = {
  //name: "main-content",
  data: function () {
    return {
      name: 'NavBarMenu',
      ui: undefined,
      wordCount: 0,
      imageCount: 0,
      tableCount: 0,
      iframeCount: 0,
      //timeSpent: 130320,
      timeSpentSecond: 0,
      lastEditTimestamp: 0,
      //timeSpent: 61,
    }
  },
  props: ['mode'],
  mounted: function () {
    this.init()
  },
  computed: {
    
  },
  methods: {
    
  },
}

import NavBarMenuMethods from './NavBarMenuMethods.js'
NavBarMenuMethods(NavBarMenu)

import NavBarMenuComputed from './NavBarMenuComputed.js'
NavBarMenuComputed(NavBarMenu)

export default NavBarMenu