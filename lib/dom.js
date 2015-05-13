var dom = exports

dom.siblings = function siblings(node) {
  var sibs = []
  var sib = node.parentNode.firstChild
  while (sib) {
    if (sib.nodeType === 1 && sib !== node)
      sibs.push(sib)
    sib = sib.nextSibling
  }
  return sibs
}

dom.clearInputs = function clearInputs(sel) {
  var inputs = document.querySelectorAll(sel)
  for (var i=0, len=inputs.length; i<len; i++) {
    inputs[i].setAttribute('value', '')
  }
}
