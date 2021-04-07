import hotkeys from './hotkeys.min.js'

hotkeys.filter = function (event) {
  let tagName = (event.target || event.srcElement).tagName;
  hotkeys.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
  return true;
}

export default hotkeys