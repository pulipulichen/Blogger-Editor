
import TurndownService from 'turndown'
var turndownService = new TurndownService({
  headingStyle: 'atx'
})

import {gfm} from 'turndown-plugin-gfm'
// var turndownPluginGfm = require('turndown-plugin-gfm')
// var gfm = turndownPluginGfm.gfm
// Use the gfm plugin
turndownService.use(gfm)

// import markdownIt from "markdown-it";
// const mdIt = markdownIt().use(require("markdown-it-multimd-table"));

// Step 3: Add custom rule for tables
// turndownService.addRule('table', {
//   filter: 'table',
//   replacement: function(content) {
//     return '\n' + content + '\n';
//   }
// });

import SummerNoteCode from './../EditorManager/SummerNote/SummerNoteCode.js'

const he = require('he');

export default function (app) {
  if (!app.methods) {
    app.methods = {}
  }

  function htmlTableToMarkdown(tableHTML) {
    // Create a temporary div element to hold the HTML
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableHTML.trim();
  
    // Get the table element
    var table = tempDiv.querySelector('table');
  
    if (!table) {
      console.error('No table found in the provided HTML');
      return '';
    }
  
    // Get the table rows
    var rows = Array.from(table.querySelectorAll('tr'));
  
    if (rows.length === 0) {
      console.error('No rows found in the table');
      return '';
    }
  
    // Extract the table data
    var markdown = '';
  
    for (var i = 0; i < rows.length; i++) {
      var cells = Array.from(rows[i].querySelectorAll('td, th'));
  
      var rowContent = cells.map(function (cell) {
        let html = cell.innerHTML.trim();
        html = removeHTMLTagsKeepLineBreaks(html)
        return html
        // return cell.innerHTML.trim();
        // return cell.innerText.trim();
      }).join(' | ');
  
      markdown += '| ' + rowContent + ' |\n';
  
      if (i === 0) {
        var separator = cells.map(function () {
          return '---';
        }).join(' | ');
  
        markdown += '| ' + separator + ' |\n';
      }
    }
  
    return markdown;
  }

  function removeHTMLTagsKeepLineBreaks(input) {
    // return input.replace(/<([^br\/>]*)>/gi, function (match, p1) {
    //   if (p1.toLowerCase() === 'br') {
    //     return match; // Keep <br /> tags
    //   } else {
    //     return ''; // Remove other tags
    //   }
    // });

    input = input.split('</p>').join('<br>')
    input = input.split('</div>').join('<br>')
    input = input.replace(/<(?!br\s*\/?)[^>]+>/gi, '').trim()

    if (input === '<br>' || input === '<br />' || input === '<br/>') {
        input = '&nbsp;'
    }
    else {
        while (input.endsWith('<br>')) {
            input = input.slice(0, -4).trim()
        }
        while (input.endsWith('<br/>')) {
            input = input.slice(0, -5).trim()
        }
        while (input.endsWith('<br />')) {
            input = input.slice(0, -6).trim()
        }
        while (input.startsWith('<br>')) {
            input = input.slice(4).trim()
        }
        while (input.startsWith('<br/>')) {
            input = input.slice(5).trim()
        }
        while (input.startsWith('<br />')) {
            input = input.slice(6).trim()
        }
    }
        

    return input
  }

  // function decodeHTMLEntities(htmlString) {
  //   var doc = new DOMParser().parseFromString(htmlString, 'text/html');
  //   return doc.documentElement.textContent;
  // }

  app.methods.getPostBodyMarkdown = function () {
    // let postBody = $v.EditorManager.FieldPostBody.getElement()
    // console.log(this.$t)
    let html = SummerNoteCode.GetOneFileHTML(this.$t, false)
    // console.log(html)
    let postBody = $(`<div>${html}</div>`)

    postBody.find(`[href]`).removeAttr('href')
    postBody.find(`img`).each(function () {
      let ele = $(this)

      ele.after('[IMAGE]')
      ele.remove()
    })

    // postBody.find(`table`).each(function () {
    //   let ele = $(this)

    //   let tableMarkdown = htmlTableToMarkdown(`<table>${ele.html()}</table>`)
    //   console.log(tableMarkdown)
    //   ele.after(`<div>${tableMarkdown}</div>`)
    //   ele.remove()
    // })
    // let text = postBody.text()
    let text = postBody.html()



    // text = text.replace(/<\/?[^>]+(>|$)/g, ' ');
    // while (text.indexOf('  ') > -1) {
    //   text = text.split('  ').join(' ')
    // }
    
    var markdown = turndownService.turndown(text)
    let markdownDiv = $(`<div>${markdown}</div>`)
    markdownDiv.find(`table`).each(function () {
      let ele = $(this)

      let tableMarkdown = htmlTableToMarkdown(`<table>${ele.html()}</table>`)
      // console.log(tableMarkdown)
      ele.after(`<pre>${tableMarkdown}</pre>`)
      ele.remove()
    })
    markdown = markdownDiv.html()

    markdown = markdown.split('<pre>').join('')
    markdown = markdown.split('</pre>').join('')
    // markdown = mdIt.render(markdown)

    markdown = markdown.split('\\[').join('[')
    markdown = markdown.split('\\]').join(']')
    markdown = markdown.split('\\.').join('.')
    markdown = markdown.split('\\_').join('_')

    markdown = markdown.trim()

    if (markdown.startsWith('[IMAGE]')) {
      markdown = markdown.slice(7).trim()
    }
    
    markdown = he.decode(markdown)

    // console.log(markdown)

    return markdown
  }

  app.methods.getPostBodyMarkdownParts = function () {
    let markdown = this.getPostBodyMarkdown()

    let parts = markdown.split('\n\n## ')

    let output = []
    let limit = 1500
    // limit = 50

    let tempPart = parts[0]
    for (let i = 1; i < parts.length; i++) {
      if (tempPart.length > limit) {
        output.push(tempPart)
        tempPart = ''
      }
      else if (tempPart === '') {
        tempPart = '## ' + parts[i]
      }
      else {
        tempPart = tempPart + '\n\n## ' + parts[i]
      }
    }

    if (tempPart !== '') {
      output.push(tempPart)
    }

    output = output.map(part => {
      part = part.trim()

      if (part.endsWith('* * *')) {
        part = part.slice(0, -5).trim()
      }
      return part
    })

    return output
  }
}