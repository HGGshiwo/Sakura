import { Document } from "domhandler";

declare function getDomFromString(str: string): Dom;

class Dom {
    _dom: Document;
    src: string | null;
    href: string | null;
    innerHTML: string;
    style:string;
    
    constructor(dom: Document);
    getElementsByClass(className: string): Dom[] | null;
    getElementsByTagName(tagName: string): Dom[] | null;
    getElementById(id: string): Dom | null;
    
}

export { Dom, getDomFromString }