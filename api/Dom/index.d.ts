import { Document } from "domhandler";

declare function getDomFromString(str: string): Dom;

class Dom {
    _dom: Document;
    src: string | null;
    _src: string| null;
    href: string | null;
    title: string | null;
    "data-vid": string|null;
    "data-src": string|null;
    "data-original": string|null;
    innerHTML: string;
    style:string;
    
    constructor(dom: Document);
    getElementsByClassName(className: string): Dom[] | null;
    getElementsByTagName(tagName: string): Dom[] | null;
    getElementById(id: string): Dom | null;
    
}

export { Dom, getDomFromString }