module.exports = {
  removeComment: function (str) {
    str = ('__' + str + '__').split('');
    var mode = {
        singleQuote: false,
        doubleQuote: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        condComp: false 
    };
    for (var i = 0, l = str.length; i < l; i++) {
 
        if (mode.regex) {
            if (str[i] === '/' && str[i-1] !== '\\') {
                mode.regex = false;
            }
            continue;
        }
 
        if (mode.singleQuote) {
            if (str[i] === "'" && str[i-1] !== '\\') {
                mode.singleQuote = false;
            }
            continue;
        }
 
        if (mode.doubleQuote) {
            if (str[i] === '"' && str[i-1] !== '\\') {
                mode.doubleQuote = false;
            }
            continue;
        }
 
        if (mode.blockComment) {
            if (str[i] === '*' && str[i+1] === '/') {
                str[i+1] = '';
                mode.blockComment = false;
            }
            str[i] = '';
            continue;
        }
 
        if (mode.lineComment) {
            if (str[i+1] === 'n' || str[i+1] === 'r') {
                mode.lineComment = false;
            }
            str[i] = '';
            continue;
        }
 
        if (mode.condComp) {
            if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
                mode.condComp = false;
            }
            continue;
        }
 
        mode.doubleQuote = str[i] === '"';
        mode.singleQuote = str[i] === "'";
 
        if (str[i] === '/') {
 
            if (str[i+1] === '*' && str[i+2] === '@') {
                mode.condComp = true;
                continue;
            }
            if (str[i+1] === '*') {
                str[i] = '';
                mode.blockComment = true;
                continue;
            }
            if (str[i+1] === '/') {
                str[i] = '';
                mode.lineComment = true;
                continue;
            }
            mode.regex = true;
 
        }
 
    }
    return str.join('').slice(2, -2);
  },
  removeCommentString: function (code) {
    var output = []
    var parts = code.split("/*")
    output.push(parts[0])
    for (var i = 1; i < parts.length; i++) {
      var part = parts[i]
      output.push(part.slice(part.indexOf("*/")+2, part.length))
    }
    return output.join("")
  },
  removeEmptyLine: function (str) {
    var lines = str.split("\n")
    str = []
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (line !== "") {
        str.push(line)
      }
    }
    return str.join("\n")
  },
  removeNewLineInStyle: function (str) {
    var lines = str.split("\n")
    str = []
    var styleLine = ""
    var isStyle = false
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i]
      if (isStyle === false) {
        str.push(line)
        
        // 偵測字尾是不是括弧
        if (line.endsWith("{")) {
          
        }
      }
    }
    return str.join("\n")
  },
  countBracketEndIsNotSingleLine: function (str) {
    var count = 0
    var lines = str.split("\n")
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (line !== "}" && line.indexOf("}") > -1) {
        count++
      }
    }
    console.log(count)
  },
  countBracketStartIsNotInLineEnd: function (str) {
    var count = 0
    var lines = str.split("\n")
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim()
      if (line.endsWith("{") === false && line.indexOf("{") > -1) {
        count++
      }
    }
    console.log(count)
  },
  reformatSelector: function (str) {
    var selectorHeaderList = []
    
    var styleList = str.split("}\n")
    for (var i = 0; i < styleList.length; i++) {
      if (styleList[i].trim() === "") {
        continue;
      }
      
      var styleComponents = styleList[i].split("{\n")
      if (styleComponents.length !== 2) {
        throw "出錯了！這個{不能分割為兩個！" + styleComponents.length + " " + styleComponents[0]
      }
      
      var selectorList = styleComponents[0].split(",\n")
      for (var j = 0; j < selectorList.length; j++) {
        var selectorParts = selectorList[j].split(" ")
        var selectorHeader = selectorParts[0]
        
        if (selectorHeader === "html" || selectorHeader === "body") {
          selectorHeader = selectorHeader + " ." + this.virtualClassName
        }
        else {
          selectorHeader = "." + this.virtualClassName + " " + selectorHeader
        }
        
        if (selectorHeaderList.indexOf(selectorHeader) === -1) {
          selectorHeaderList.push(selectorHeader)
        }
        
        selectorParts[0] = selectorHeader
        
        selectorList[j] = selectorParts.join(" ")
      }
      
      styleComponents[0] = selectorList.join(",\n")
      
      styleList[i] = styleComponents.join("{\n")
    }
    //console.log(selectorHeaderList)
    return styleList.join("}\n")
  },
  reformatStyle: function (style) {
    if (style.trim() === "") {
      return style
    }
    var styleComponents = style.split("{\n")
    if (styleComponents.length === 1) {
      return style
    }
    else if (styleComponents.length !== 2) {
      console.log(style)
      throw "出錯了！這個{不能分割為兩個！" + styleComponents.length + " " + styleComponents[0]
    }

    var selectorList = styleComponents[0].split(",\n")
    for (var j = 0; j < selectorList.length; j++) {
      var selectorParts = selectorList[j].split(" ")
      var selectorHeader = selectorParts[0]

      if (selectorHeader.trim() === "from" 
              || selectorHeader.trim() === "to" 
              || selectorHeader.trim().startsWith("@")
              || selectorHeader.trim().endsWith("%")
              || selectorHeader.trim() === "@font-face") {
        // do nothing
      }
      else if (selectorHeader === "html" || selectorHeader === "body") {
        selectorHeader = selectorHeader + " ." + this.virtualClassName
      }
      else {
        selectorHeader = "." + this.virtualClassName + " " + selectorHeader
      }

      if (this.selectorHeaderList.indexOf(selectorHeader) === -1) {
        this.selectorHeaderList.push(selectorHeader)
      }

      selectorParts[0] = selectorHeader

      selectorList[j] = selectorParts.join(" ")
    }
    styleComponents[0] = selectorList.join(",\n")

    style = styleComponents.join("{\n")
    return style
  },
  virtualClassName: "non-invasive-web-style-framework",
  selectorHeaderList: [],
  reformatRuleSelector: function (str) {
    var output = ""
    var lastIndex = -1
    var isUnderRule = false
    var endFlag = false
    
    do {
      var bracketStart = str.indexOf("{", lastIndex)
      //console.log(lastIndex)
      if (bracketStart === -1) {
        break
      }
      isUnderRule = str.slice(bracketStart+1, str.indexOf("{", bracketStart+1)).indexOf("}") === -1
      if (isUnderRule === true) {
        // 處理有規則的部分
        var ruleBracketEnd = str.indexOf("}\n}\n", lastIndex)
        if (ruleBracketEnd < lastIndex) {
          ruleBracketEnd = str.length
          endFlag = true
        }
        var rule = str.slice(lastIndex, ruleBracketEnd+4)
        
        var ruleSelector = rule.slice(0, rule.indexOf("{\n"))
        console.log(ruleSelector)
        
        var rules = rule.slice(rule.indexOf("{\n")+2, rule.length-1).split("}\n")
        for (var i = 0; i < rules.length; i++) {
          rules[i] = this.reformatStyle(rules[i])
        }
        
        output = output + ruleSelector + "{\n" + rules.join("}\n") + "}"
        
        // 最後爬到下一個end的地方
        lastIndex = ruleBracketEnd + 4
      }
      else {
        // 處理普通的部分
        var bracketEnd = str.indexOf("}\n", lastIndex)
        if (bracketEnd < lastIndex) {
          bracketEnd = str.length
          endFlag = true
        }
        
        var style = str.slice(lastIndex, bracketEnd+2)
        output = output + this.reformatStyle(style)
        
        // 最後爬到下一個end的地方
        lastIndex = bracketEnd + 2
      }
      
      
    } while (endFlag === false)
    
    return output
  },
  reformatRules: function (str) {
    var parts = str.split("}\n}\n")
    
    var _this = this
    var reformatStyles = function (styles) {
      //return styles
      
      //console.log(styles.slice(0, 30))
      var parts = styles.split("}\n")
      for (var i = 0; i < parts.length; i++) {
        parts[i] = _this.reformatStyle(parts[i])
      }
      return parts.join("}\n")
    }
    
    var reformatRule = function (part) {
      var ruleSplitPoint = part.lastIndexOf("}\n@")
      var styles = parts[i].slice(0, ruleSplitPoint + 2)
      //console.log(styles.slice(0, 20))
      styles = reformatStyles(styles)
      
      var rule = parts[i].slice(ruleSplitPoint + 2, parts[i].length)
      var ruleSelector = rule.slice(0, rule.indexOf("{\n"))
      var ruleStyles = rule.slice(rule.indexOf("{\n")+2)
      ruleStyles = reformatStyles(ruleStyles)
      rule = ruleSelector + "{\n" + ruleStyles
      
      return styles + rule
    }
    
    for (var i = 0; i < parts.length; i++) {
      parts[i] = reformatRule(parts[i])
      
    }
    //parts[(parts.length-1)] = reformatRule(parts[(parts.length-1)])
    
    // 最後一份，只有style
    
    
    return parts.join("}\n}\n")
  }
};
