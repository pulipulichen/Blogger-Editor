let msg = new SpeechSynthesisUtterance();

let splitMulti = function (str, tokens) {
  var tempChar = tokens[0]; // We can use the first token as a temporary join character
  for (var i = 1; i < tokens.length; i++) {
    str = str.split(tokens[i]).join(tempChar);
  }
  str = str.split(tempChar);
  return str;
}

let splitor1 = ['。', ':', '：', '；', '\n', '\t']
let splitor2 = ['，', ',', '、']
let speakRate = 1

let SpeakUtil = {
  isSpeaking: false,
  rate: 1.5,
  setRate () {
    
  },
  speechSynthesis: window.speechSynthesis,
  stop () {
    this.speechSynthesis.cancel()
    this.isSpeaking = false
  },
  speak: function (text, rate) {
      //console.log(text)
      if (typeof(text) !== 'string') {
        this.isSpeaking = false
        return false
      }
      
      if (typeof(rate) === 'number') {
        this.rate = rate
      }
      
      return new Promise((resolve) => {

        this.isSpeaking = true

        // 需要分段
        let textParts = this.splitSpeechTextToParts(text)
        //console.log(textParts)
        // -------------

        let tooLongMessage = `The message is too long.`
        for (let i = 0, max = textParts.length; i < max; i++) {
          let text = textParts[i]
          if (text.length > 100) {
            //console.error(tooLongMessage, text)
            msg.text = tooLongMessage
            msg.rate = this.rate
            this.speechSynthesis.cancel()
            this.speechSynthesis.speak(msg)
            this.isSpeaking = false
            resolve()
            return false
          }
        }

        // ------------

        let loop = (i) => {
          if (this.isSpeaking === false) {
            return false
          }

          if (i < textParts.length) {
            msg.text = textParts[i]
            msg.rate = this.rate
            //console.log(this.localConfig.speechSynthesisRate)
  //          let isEnd = false
            //console.log(msg.text)
            msg.onend = () => {
  //            isEnd = true
              //console.log('結束')
              i++
              loop(i)
            }


            //console.log(msg)
            this.speechSynthesis.cancel()
            this.speechSynthesis.speak(msg)
          }
          else {
            this.isSpeaking = false
            //console.log('')
            resolve()
          }
        }

        loop(0)

        //this.closeMenu()
      
      })  // return new Promise((resolve) => {
    },
    splitSpeechTextToParts: function (text) {
      let p = text
      p = p.replace(/ *\([^)]*\) */g, "")
      p = p.replace(/ *\[[^)]*\] */g, "")
      p = p.replace(/ *\{[^)]*\} */g, "")
      p = p.split('ɑ').join('α')
      p = p.split('@').join(' at ')
      
      p = p.split('（').map((p2, i) => {
        if (i === 0) {
          return p2
        }

        let endPos = p2.indexOf('）')
        if (endPos === -1) {
          return ''
        }
        return p2.slice(endPos + 1)
      }).join('')
      //p = p.replace(/ *\（[^)]*\） */g, "")
      //p = p.replace(/ *（[^)]*） */g, "")
      //p = p.replace(/ *「[^)]*」 */g, "")
      text = p
      
      let parts = splitMulti(text, splitor1)
      parts = parts.filter(p => p.trim() !== '')
      
      // ----------------------------
      // 第二階段細分
      let tempParts = []
      let subSeperators = splitor2
      parts.forEach(text => {
        
        if (text.length < 100) {
          return tempParts.push(text)
        }
        
        let lastSeperator, lastSeperatorPos, lastSeperatorTempPos
        let tempText = []
        for (let i = 0, max = text.length; i < max; i++) {
          let t = text[i]
          tempText.push(t)
          
          if (tempText.length === 100) {
            if (!lastSeperatorPos) {
              tempParts.push(tempText.join(''))
              tempText = []
            }
            else {
              tempParts.push(tempText.slice(0, lastSeperatorTempPos - 1).join(''))
              i = lastSeperatorPos
              tempText = []
            }
          }
          
          if (subSeperators.indexOf(t) > -1) {
            lastSeperator = t
            lastSeperatorPos = i
            lastSeperatorTempPos = tempText.length
          }
        }
        
        if (tempText.length > 0) {
          tempParts.push(tempText.join(''))
        }
      })
      
      parts = tempParts
      // ----------------------------
      
      //console.log(parts)
      return parts
    }
}

export default SpeakUtil