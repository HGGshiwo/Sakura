import {
  getAttributeValue,
  getElementById,
  getElements,
  getElementsByTagName,
  innerText,
} from 'domutils';
import {parseDocument} from 'htmlparser2';

const getDomFromString = str => {
  return new Dom(parseDocument(str));
};

class Dom {
  constructor(dom) {
    attributes = ["src", "data-vid", "href", "style", "title", "data-src"]
    this._dom = dom;
    attributes.forEach(attribute => {
      this[attribute] = getAttributeValue(this._dom, attribute)
    });
    this.innerHTML = innerText(this._dom)
  }

  getElementsByClassName(className) {
    let results = getElements({class: className}, this._dom, true);
    return results.map(result => {
      return new Dom(result);
    });
  }

  getElementsByTagName(tagName) {
    let results = getElementsByTagName(tagName, this._dom, true);
    return results.map(result => {
      return new Dom(result);
    });
  }

  getElementById(id) {
    let el = getElements({id}, this._dom, true);
    let newDom = null;
    if (el.length != 0) {
      newDom = new Dom(el[0])
    }
    return newDom;
  }
}

export {Dom, getDomFromString};
