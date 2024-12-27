// node_modules/.pnpm/github.com+martian17+htmlgen@20285340c5f351fa860e4bb889b6b44f4e3cccf7/node_modules/htmlgen/dist/maplist.js
var MapList = class {
  constructor() {
    this.objmap = /* @__PURE__ */ new Map();
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  get size() {
    return this.objmap.size;
  }
  push_back(elem) {
    if (this.has(elem))
      this.delete(elem);
    let ref = {
      prev: null,
      next: null,
      elem
    };
    this.objmap.set(elem, ref);
    if (this.tail === null) {
      this.head = ref;
      this.tail = ref;
    } else {
      this.tail.next = ref;
      ref.prev = this.tail;
      this.tail = ref;
    }
  }
  pop_back() {
    let tail = this.tail;
    if (tail === null) {
      console.log("warning: trying to pop an empty list");
      return void 0;
    }
    this.tail = tail.prev;
    if (this.tail !== null)
      this.tail.next = null;
    this.objmap.delete(tail.elem);
    return tail.elem;
  }
  push_front(elem) {
    if (this.has(elem))
      this.delete(elem);
    console.log("inserting front: ", elem);
    if (this.head === null) {
      this.push_back(elem);
    } else {
      this.insertBefore(elem, this.head.elem);
    }
  }
  pop_front() {
    if (this.head === null) {
      return void 0;
    } else {
      let h = this.head.elem;
      this.delete(h);
      return h;
    }
  }
  delete(elem) {
    if (!this.objmap.has(elem)) {
      console.log("warning: trying to delete an empty element");
      return;
    }
    let ref = this.objmap.get(elem);
    if (ref.prev === null) {
      this.head = ref.next;
    } else {
      ref.prev.next = ref.next;
    }
    if (ref.next === null) {
      this.tail = ref.prev;
    } else {
      ref.next.prev = ref.prev;
    }
    this.objmap.delete(elem);
  }
  has(elem) {
    return this.objmap.has(elem);
  }
  getNext(elem) {
    if (!this.objmap.has(elem)) {
      throw new Error("Error: trying to get an element that does not exist");
    }
    let ref = this.objmap.get(elem);
    if (ref.next === null)
      return void 0;
    return ref.next.elem;
  }
  getPrev(elem) {
    if (!this.objmap.has(elem)) {
      throw new Error("Error: trying to get an element that does not exist");
    }
    let ref = this.objmap.get(elem);
    if (ref.prev === null)
      return void 0;
    return ref.prev.elem;
  }
  getHead() {
    if (this.head === null) {
      return void 0;
    }
    return this.head.elem;
  }
  getTail() {
    if (this.tail === null) {
      return void 0;
    }
    return this.tail.elem;
  }
  insertBefore(elem1, elem2) {
    if (!this.objmap.has(elem2)) {
      console.log("warning: trying to insert before a non-member element");
      return;
    }
    if (elem1 === elem2) {
      console.log("Warning: trying to insert before itself");
      return;
    }
    if (this.has(elem1))
      this.delete(elem1);
    let ref2 = this.objmap.get(elem2);
    let ref1 = {
      prev: ref2.prev,
      next: ref2,
      elem: elem1
    };
    this.objmap.set(elem1, ref1);
    let ref0 = ref2.prev;
    ref2.prev = ref1;
    if (ref0 === null) {
      this.head = ref1;
    } else {
      ref0.next = ref1;
    }
  }
  insertAfter(elem1, elem2) {
    if (!this.objmap.has(elem1)) {
      console.log("warning: trying to insert after a non-member element");
      return;
    }
    if (elem1 === elem2) {
      console.log("Warning: trying to insert after itself");
      return;
    }
    if (this.has(elem2))
      this.delete(elem2);
    let ref1 = this.objmap.get(elem1);
    let ref2 = {
      prev: ref1,
      next: ref1.next,
      elem: elem2
    };
    this.objmap.set(elem2, ref2);
    let ref3 = ref1.next;
    ref1.next = ref2;
    if (ref3 === null) {
      this.tail = ref2;
    } else {
      ref3.prev = ref2;
    }
  }
  foreach(cb) {
    let ref = this.head;
    while (ref !== null) {
      let next = ref.next;
      cb(ref.elem);
      ref = next;
    }
  }
  clear() {
    this.head = null;
    this.tail = null;
    this.objmap.clear();
  }
  replace(elem, rep) {
    let ref = this.objmap.get(elem);
    if (!ref) {
      throw new Error("element does not exist");
    }
    ref.elem = rep;
    this.objmap.delete(elem);
    this.objmap.set(rep, ref);
    return elem;
  }
  toArray() {
    let arr = [];
    this.foreach((elem) => {
      arr.push(elem);
    });
    return arr;
  }
  [Symbol.iterator]() {
    let ref = this.head;
    return {
      next: () => {
        if (ref === null)
          return { done: true };
        let ref0 = ref;
        ref = ref.next;
        return { value: ref0.elem, done: false };
      }
    };
  }
  *loopRange(a, b) {
    if (!a)
      return;
    if (this.head === null)
      return;
    let ref = this.objmap.get(a);
    while (ref && ref.elem !== b) {
      let next = ref.next;
      yield ref.elem;
      ref = next;
    }
  }
  loop() {
    return this.loopRange(this.getHead());
  }
  loopUntil(elem) {
    return this.loopRange(this.getHead(), elem);
  }
  loopFrom(elem) {
    return this.loopRange(elem);
  }
  //reverse loops
  *loopReverseRange(a, b) {
    if (!a)
      return;
    if (this.head === null)
      return;
    let ref = this.objmap.get(a);
    while (ref && ref.elem !== b) {
      let prev = ref.prev;
      yield ref.elem;
      ref = prev;
    }
  }
  loopReverse() {
    return this.loopReverseRange(this.getTail());
  }
  loopReverseUntil(elem) {
    return this.loopReverseRange(this.getTail(), elem);
  }
  loopReverseFrom(elem) {
    return this.loopReverseRange(elem);
  }
  getNth(n) {
    if (n >= this.size || n < 0) {
      return void 0;
    }
    let ref = this.head;
    for (let i = 0; i < n; i++) {
      if (!ref)
        return;
      ref = ref.next;
    }
    if (!ref)
      return;
    return ref.elem;
  }
  // Aliases
  push(elem) {
    this.push_back(elem);
  }
  pop() {
    this.pop_back();
  }
};

// node_modules/.pnpm/github.com+martian17+htmlgen@20285340c5f351fa860e4bb889b6b44f4e3cccf7/node_modules/htmlgen/dist/index.js
var BaseELEM = class _BaseELEM {
  constructor() {
    this.parent = null;
  }
  static fromElement(e) {
    if (this === _BaseELEM) {
      let elem2;
      switch (e.nodeType) {
        case 1:
          elem2 = new ELEM();
          break;
        case 2:
          elem2 = new AttributeELEM();
          break;
        case 3:
          elem2 = new TextELEM();
          break;
        case 4:
          elem2 = new DataSectionELEM();
          break;
        case 5:
          elem2 = new EntityPreferenceELEM();
          break;
        case 6:
          elem2 = new EntityELEM();
          break;
        case 7:
          elem2 = new ProcessingInstructionELEM();
          break;
        case 8:
          elem2 = new CommentELEM();
          break;
        case 9:
          elem2 = new DocumentELEM();
          break;
        case 10:
          elem2 = new DocumentTypeELEM();
          break;
        case 11:
          elem2 = new DocumentFragmentELEM();
          break;
        case 12:
          elem2 = new NotationELEM();
          break;
        default:
          throw new Error(`Unknown node type ${e.nodeType}`);
      }
      elem2.e = e;
      if (e.nodeType === 1) {
        for (const child of e.childNodes) {
          elem2.children.push(_BaseELEM.fromElement(child));
        }
      }
      return elem2;
    }
    const elem = new this();
    elem.e = e;
    if (elem instanceof ELEM) {
      for (const child of e.childNodes) {
        elem.children.push(_BaseELEM.fromElement(child));
      }
    }
    return elem;
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    } else if (this.e.parentNode) {
      console.log("Warning: removing an element through raw dom");
      this.e.parentNode.removeChild(this.e);
    }
    return this;
  }
};
var AttributeELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 2;
  }
};
var TextELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 3;
  }
};
var DataSectionELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 4;
  }
};
var EntityPreferenceELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 5;
  }
};
var EntityELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 6;
  }
};
var ProcessingInstructionELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 7;
  }
};
var CommentELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 8;
  }
};
var DocumentELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 9;
  }
};
var DocumentTypeELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 10;
  }
};
var DocumentFragmentELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 11;
  }
};
var NotationELEM = class extends BaseELEM {
  constructor() {
    super(...arguments);
    this.nodeType = 12;
  }
};
var getELEM = function(nname, attrs, inner, style) {
  if (nname instanceof BaseELEM)
    return nname;
  if (typeof nname === "string")
    return ELEM.create(nname, attrs, inner, style);
  return BaseELEM.fromElement(nname);
};
var ELEMList = class extends MapList {
  getInstance(e) {
    for (let child of this.loop()) {
      if (child.e === e)
        return child;
    }
    return void 0;
  }
};
var ELEM = class _ELEM extends BaseELEM {
  constructor(nname, attrs, inner, style) {
    super();
    this.nodeType = 1;
    this.parent = null;
    this.children = new ELEMList();
    if (!nname)
      return;
    this.e = document.createElement(nname);
    if (attrs)
      this.setAttrs(attrs);
    if (inner)
      this.setInner(inner);
    if (style)
      this.setStyle(style);
  }
  static create(nname, attrs, inner, style) {
    const elem = new _ELEM();
    elem.e = document.createElement(nname);
    if (attrs)
      elem.setAttrs(attrs);
    if (inner)
      elem.setInner(inner);
    if (style)
      elem.setStyle(style);
    return elem;
  }
  setAttrs(attrs) {
    for (let key in attrs) {
      this.e.setAttribute(key, attrs[key]);
    }
  }
  setStyle(style) {
    for (let key in style) {
      this.e.style[key] = style[key];
    }
  }
  setInner(inner) {
    this.children.clear();
    this.e.innerHTML = inner;
    let childNodes = this.e.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      let child = BaseELEM.fromElement(childNodes[i]);
      if (!child)
        continue;
      child.parent = this;
      this.children.push(child);
    }
    return this;
  }
  push_back(a, b, c, d) {
    const elem = getELEM(a, b, c, d);
    elem.remove();
    elem.parent = this;
    this.children.push(elem);
    this.e.appendChild(elem.e);
    return elem;
  }
  pop_back() {
    let elem = this.children.getTail();
    elem === null || elem === void 0 ? void 0 : elem.remove();
    return elem;
  }
  push_front(a, b, c, d) {
    const elem = getELEM(a, b, c, d);
    elem.remove();
    elem.parent = this;
    this.children.push_front(elem);
    if (this.e.children.length === 0) {
      this.e.appendChild(elem.e);
    } else {
      this.e.insertBefore(elem.e, this.e.children[0]);
    }
    return elem;
  }
  pop_front() {
    let elem = this.children.getHead();
    elem === null || elem === void 0 ? void 0 : elem.remove();
    return elem;
  }
  attr(key, value) {
    if (typeof key !== "string") {
      this.setAttrs(key);
      return;
    }
    this.e.setAttribute(key, value);
    return this;
  }
  style(key, value) {
    if (typeof key !== "string") {
      this.setStyle(key);
      return;
    }
    this.e.style[key] = value;
  }
  removeChild(elem) {
    this.children.delete(elem);
    this.e.removeChild(elem.e);
    elem.parent = null;
    return this;
  }
  insertBefore(a, b, c, d) {
    if (b instanceof BaseELEM) {
      const elem1 = a;
      const elem2 = b;
      elem1.remove();
      this.e.insertBefore(elem1.e, elem2.e);
      this.children.insertBefore(elem1, elem2);
      elem1.parent = this;
      return elem1;
    } else {
      const parent = this.parent;
      if (!parent) {
        throw new Error("parent to the node not defined");
      }
      const elem1 = getELEM(a, b, c, d);
      parent.insertBefore(elem1, this);
      return elem1;
    }
  }
  insertAfter(a, b, c, d) {
    if (b instanceof BaseELEM) {
      const elem1 = a;
      const elem2 = b;
      let next = this.children.getNext(elem1);
      if (next === void 0) {
        return this.push_back(elem2);
      } else {
        return this.insertBefore(elem2, next);
      }
    } else {
      let parent = this.parent;
      if (!parent) {
        throw new Error("parent to the node not defined");
      }
      const elem1 = getELEM(a, b, c, d);
      return parent.insertAfter(this, elem1);
    }
  }
  replaceChild(elem, rep) {
    this.insertAfter(elem, rep);
    elem.remove();
    return rep;
  }
  replaceInPlace(elem) {
    if (this.parent) {
      this.parent.replaceChild(this, elem);
    } else {
      elem.remove();
      const parent = this.e.parentNode;
      if (!parent)
        return;
      parent.removeChild(this.e);
      parent.appendChild(elem.e);
    }
  }
  on(evt, cb) {
    this.e.addEventListener(evt, cb);
    return cb;
  }
  off(evt, cb) {
    this.e.removeEventListener(evt, cb);
    return cb;
  }
  once(evt) {
    let that = this;
    let cbs = [];
    for (let i = 1; i < arguments.length; i++) {
      let cb = arguments[i];
      let evtfunc = function(cb2, e) {
        for (let i2 = 0; i2 < cbs.length; i2++) {
          that.e.removeEventListener(evt, cbs[i2]);
        }
        cbs = [];
        cb2(e);
      }.bind(null, cb);
      cbs.push(evtfunc);
      this.e.addEventListener(evt, evtfunc);
    }
    return {
      remove: function() {
        for (let i = 0; i < cbs.length; i++) {
          that.e.removeEventListener(evt, cbs[i]);
        }
      }
    };
  }
  getX() {
    let e = this.e;
    return e.offsetLeft;
  }
  getY() {
    let e = this.e;
    return e.offsetTop;
  }
  getWidth() {
    let e = this.e;
    return e.offsetWidth;
  }
  getHeight() {
    let e = this.e;
    return e.offsetHeight;
  }
  getNext() {
    if (!this.parent) {
      throw new Error("unsupported operation: parent not registered");
    }
    return this.parent.children.getNext(this);
  }
  getPrev() {
    if (!this.parent) {
      throw new Error("unsupported operation: parent not registered");
    }
    return this.parent.children.getPrev(this);
  }
  getDescendent(e) {
    let chain = [];
    while (e !== this.e) {
      chain.push(e);
      if (e.parentNode) {
        e = e.parentNode;
      } else {
        throw new Error("getDescendent: Not a descendent");
      }
    }
    let elem = this;
    while (chain.length !== 0) {
      const e2 = chain.pop();
      elem = elem.children.getInstance(e2);
    }
    return elem;
  }
  query(query) {
    const e = this.e.querySelector(query);
    if (!e)
      return void 0;
    return this.getDescendent(e);
  }
  queryAll(query) {
    let that = this;
    return [...this.e.querySelectorAll(query)].map((e) => that.getDescendent(e));
  }
  get rect() {
    return this.e.getBoundingClientRect();
  }
  get prev() {
    return this.getPrev();
  }
  get next() {
    return this.getNext();
  }
  get head() {
    return this.children.getHead();
  }
  get tail() {
    return this.children.getTail();
  }
  add(a, b, c, d) {
    return this.push_back(a, b, c, d);
  }
  push(a, b, c, d) {
    return this.push_back(a, b, c, d);
  }
  pop() {
    return this.pop_back();
  }
  class(classname) {
    this.e.classList.add(classname);
  }
  id(id) {
    this.attr("id", id);
  }
};
var CSS = {
  css: "",
  add: function(str) {
    this.css += str;
  },
  init: function() {
    let head = getELEM(document.head);
    let blob = new Blob([this.css], { type: "text/css" });
    let link = head.add(getELEM("link", { rel: "stylesheet" }));
    link.attr("href", URL.createObjectURL(blob));
  }
};

// src/extensions.js
ELEM.prototype.getBus = function() {
  if (!this.bus) {
    this.bus = /* @__PURE__ */ new Map();
  }
  return this.bus;
};
ELEM.prototype.on = function(evt, cb0) {
  const bus = this.getBus();
  if (!bus.has(evt)) {
    bus.set(evt, /* @__PURE__ */ new Map());
  }
  const cb1 = (...vals) => {
    if (this.disabled)
      return;
    cb0(...vals);
  };
  this.bus.get(evt).set(cb0, cb1);
  if (evt[0] !== "_") {
    this.e.addEventListener(evt, cb1);
  }
  return cb0;
};
ELEM.prototype.off = function(evt, cb0) {
  const bus = this.getBus();
  if (!bus.has(evt)) {
    console.log("Event DNE");
    return cb0;
  }
  const map = this.bus.get("evt");
  if (!map.has(cb0)) {
    console.log("Handler DNE");
  }
  if (evt[0] !== "_")
    this.e.removeEventListener(map.get(cb0));
  map.delete(cb0);
  return cb0;
};
ELEM.prototype.emit = function(evt, ...args) {
  const bus = this.getBus();
  const cbs = bus.get(evt);
  if (!cbs)
    return false;
  for (let [cb0, cb1] of cbs) {
    cb1(...args);
  }
};
ELEM.prototype.once = function(evt) {
  return new Promise((res) => {
    let cb;
    this.on(evt, cb = (val) => {
      this.off(cb);
      res(val);
    });
  });
};
Object.defineProperty(ELEM.prototype, "classList", {
  get: function classList() {
    return this.e.classList;
  }
});
Object.defineProperty(ELEM.prototype, "disabled", {
  get: function disabled() {
    return this._disabled || false;
  },
  set: function disabled2(val) {
    val = !!val;
    this._disabled = val;
    if (val === true) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
  }
});
ELEM.prototype.I = function(cb) {
  cb(I);
  return this;
};
ELEM.prototype.T = function(cb) {
  return cb(this);
};

// src/util.js
var apiUrl = "http://localhost:5080/api";
ELEM.prototype.destroy = function() {
  let children = [...this.children];
  for (let child of children) {
    child.remove();
  }
};
var get = async function(path) {
  return await (await fetch(apiUrl + path)).json().catch((e) => "");
};
var post = async function(path, body) {
  return await (await fetch(apiUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })).json().catch((e) => "");
};
var newarr = function(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(n);
  }
  return arr;
};
var editDistance = function(a, b) {
  const rl = a.length + 1;
  const cl = b.length + 1;
  const arr = newarr(rl * cl);
  for (let i = 0; i < rl; i++) {
    arr[i] = i;
  }
  for (let i = 0; i < cl; i++) {
    arr[rl * i] = i;
  }
  for (let bi = 1; bi < cl; bi++) {
    for (let ai = 1; ai < rl; ai++) {
      const idx = bi * rl + ai;
      const nn = arr[idx - rl];
      const ww = arr[idx - 1];
      const nw = arr[idx - rl - 1];
      if (a[ai - 1] === b[bi - 1]) {
        arr[idx] = nw;
      } else {
        let mv = ww;
        if (nn < mv)
          mv = nn;
        if (nw < mv)
          mv = nw;
        arr[idx] = mv + 1;
      }
    }
  }
  return arr.at(-1);
};

// common/typeHandlers.ts
var QuizType = {
  WordToMeaning: 0,
  MeaningToWord: 1
};
var WordRecord = class _WordRecord {
  id;
  name;
  words = [];
  //private members
  wordIndex = /* @__PURE__ */ new Map();
  meaningIndex = /* @__PURE__ */ new Map();
  getByWord(word) {
    return this.wordIndex.get(word);
  }
  getByMeaning(meaning) {
    return this.meaningIndex.get(meaning);
  }
  static fromCompressed(record) {
    const length = record.words.length;
    const res = new _WordRecord();
    res.name = record.name;
    res.id = record.id;
    for (let i = 0; i < length; i++) {
      const word = {
        word: record.words[i],
        meaning: record.meanings[i],
        usecases: record.usecases[i].map((k) => record.usecaseStrings[k])
      };
      res.words.push(word);
      res.wordIndex.set(word.word, word);
      res.meaningIndex.set(word.meaning, word);
    }
    return res;
  }
  compress() {
    const usecaseIndices = /* @__PURE__ */ new Map();
    const res = {
      name: this.name,
      id: this.id,
      words: this.words.map((w) => w.word),
      meanings: this.words.map((w) => w.meaning),
      usecases: [],
      usecaseStrings: []
    };
    for (let { usecases } of this.words) {
      let uc = [];
      for (let usecase of usecases) {
        let idx;
        if ((idx = usecaseIndices.get(usecase)) !== void 0) {
          uc.push(idx);
          continue;
        }
        idx = res.usecaseStrings.length;
        res.usecaseStrings.push(usecase);
        usecaseIndices.set(usecase, idx);
        uc.push(idx);
      }
      res.usecases.push(uc);
    }
    return res;
  }
};
var Quiz = class _Quiz {
  settings;
  type;
  questions = [];
  wordRecord;
  static fromCompressed(quiz, wordRecord) {
    const res = new _Quiz();
    res.settings = quiz.settings;
    res.type = quiz.type;
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const options = quiz.options[i];
      res.questions.push({
        question: wordRecord.getByWord(question),
        options: options.map((op) => wordRecord.getByWord(op))
      });
    }
    res.wordRecord = wordRecord;
    return res;
  }
  compress() {
    const res = {
      type: this.type,
      questions: this.questions.map((q) => q.question.word),
      options: this.questions.map((q) => q.options.map((op) => op.word)),
      settings: this.settings
    };
    return res;
  }
};
var Responses = class _Responses extends Array {
  quiz;
  static fromCompressed(resps, wordRecord) {
    console.log(resps, wordRecord);
    let quiz = Quiz.fromCompressed(resps.quiz, wordRecord);
    let res = new _Responses();
    res.quiz = quiz;
    for (let i = 0; i < resps.choices.length; i++) {
      const response = {
        question: quiz.questions[i],
        choice: resps.choices[i],
        choiceWord: quiz.questions[i].options[resps.choices[i]],
        correct: true
      };
      if (quiz.type === QuizType.WordToMeaning) {
        response.correct = response.question.question.meaning === response.choiceWord.meaning;
      } else if (quiz.type === QuizType.MeaningToWord) {
        response.correct = response.question.question.word === response.choiceWord.word;
      }
      res.push(response);
    }
    return res;
  }
  compress() {
    console.log(this.quiz);
    const res = {
      quiz: this.quiz.compress(),
      choices: this.map((r) => r.choice)
    };
    return res;
  }
};

// src/quizService.ts
var noisySort = function(cb, noiseLevel) {
  return function(a, b) {
    if (a === b || Math.random() < noiseLevel) {
      return Math.random() - 0.5;
    }
    return cb(a, b);
  };
};
var similarityScore = function(a, b) {
  const ed = editDistance(a, b) + 1;
  let modifier = 1;
  if (a[0].toLowerCase() === b[0].toLowerCase())
    modifier *= 2;
  if (a.at(-1).toLowerCase() === b.at(-1).toLowerCase())
    modifier *= 2;
  return (a.length + b.length) / ed * modifier;
};
var wordHistoryToPriority = {
  repeat(wordHistory) {
    const positiveStreaks = wordHistory.getPositiveStreaks();
    const negativeStreaks = wordHistory.getNegativeStreaks();
    let val = 0;
    if (negativeStreaks) {
      return negativeStreaks + 20;
    }
    if (positiveStreaks < 3) {
      return positiveStreaks;
    }
    return -1;
  },
  sweep(wordHistory) {
    const positiveStreaks = wordHistory.getPositiveStreaks();
    const negativeStreaks = wordHistory.getNegativeStreaks();
    if (negativeStreaks) {
      return negativeStreaks + 20;
    }
    if (positiveStreaks < 3) {
      return 3 - positiveStreaks;
    }
    return -1;
  },
  random(wordHistory) {
    const positiveStreaks = wordHistory.getPositiveStreaks();
    if (positiveStreaks < 3) {
      return 1;
    }
    return -1;
  }
};
var WordHistory = class extends Array {
  getPositiveStreaks() {
    let streak = 0;
    for (let i = this.length - 1; i >= 0; i--) {
      let val = this[i];
      if (val === false)
        break;
      if (val === true)
        streak++;
    }
    return streak;
  }
  getNegativeStreaks() {
    let streak = 0;
    for (let i = this.length - 1; i >= 0; i--) {
      let val = this[i];
      if (val === true)
        break;
      if (val === false)
        streak++;
    }
    return streak;
  }
};
var tallyResponses = function(resps, wordRecord, quizType) {
  let res = new Map(wordRecord.words.map((w) => [w.word, new WordHistory()]));
  for (let resp of resps) {
    if (quizType !== void 0) {
      if (resp.quiz.type !== quizType)
        continue;
    }
    for (let r of resp) {
      const word = r.choiceWord.word;
      res.get(word).push(r.correct);
    }
  }
  return res;
};
var createOptions = function(word, words, optionSize) {
  let a1 = [];
  for (let w1 of words) {
    if (w1 === word)
      continue;
    const s = similarityScore(word, w1);
    a1.push([w1, s]);
  }
  const randomness = 0.1;
  a1 = a1.sort(noisySort((a, b) => {
    return b[1] - a[1];
  }, randomness)).map((v) => v[0]);
  let options = a1.slice(0, optionSize - 1);
  options.push(word);
  options = options.sort(() => Math.random() > 0.5).map((w) => w);
  return options;
};
var createQuiz = async function(qid, ctx2) {
  const wordRecord = WordRecord.fromCompressed((await get(`/quiz/${qid}`)).data);
  const rawWords = wordRecord.words.map((w) => w.word);
  console.log(await get(`/quiz/${qid}/responses`));
  const resps = (await get(`/quiz/${qid}/responses`)).map((compressed) => Responses.fromCompressed(compressed, wordRecord));
  const questions = [];
  const wordHistoryMap = tallyResponses(resps, wordRecord, ctx2.quizType);
  const quizWords = wordRecord.words.map((w) => w.word).sort(noisySort((w1, w2) => {
    const p1 = wordHistoryToPriority[ctx2.quizMode](wordHistoryMap.get(w1));
    const p2 = wordHistoryToPriority[ctx2.quizMode](wordHistoryMap.get(w2));
    return p2 - p1;
  }, 0.5)).slice(0, ctx2.quizLength);
  const quiz = new Quiz();
  quiz.settings = {
    quizMode: ctx2.quizMode
  };
  quiz.type = ctx2.quizType;
  quiz.questions = quizWords.map((w) => ({
    question: wordRecord.getByWord(w),
    options: createOptions(w, rawWords, ctx2.optionSize).map((w2) => wordRecord.getByWord(w2))
  }));
  return quiz;
};

// src/main.js
CSS.add(`
body{
    background-color: #fff;
}
`);
console.log(await get("/quizList"));
var ctx = {
  quizType: QuizType.WordToMeaning,
  quizMode: "repeat",
  quizLength: 2,
  optionSize: 9
};
console.log(await createQuiz("9cac9db4-231d-4db4-89bb-07739c395f20", ctx));
var topPage = async function(body) {
  body.destroy();
  body.add("H1", 0, "Choose the quiz");
  const listWrapper = body.add("div");
  for (let { name, id } of await get("/quizList")) {
    const item = listWrapper.add("div", 0, name, {
      border: "solid 1px #000",
      padding: "10px",
      margin: "20px"
    });
    item.on("click", () => {
      ctx.qid = id;
      quizPage(body);
    });
  }
};
var quizPage = async function(body) {
  body.destroy();
  const wrapper = body.add("div", 0, 0, {
    border: "solid 1px #000",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    gap: "20px"
  });
  const qid = ctx.qid;
  const responses = new Responses();
  const quiz = await createQuiz(qid, ctx);
  responses.quiz = quiz;
  const length = quiz.questions.length;
  for (let i = 0; i < length; i++) {
    const question = quiz.questions[i];
    const header = wrapper.add("div", 0, question.question.word, {
      border: "solid 1px #000",
      textAlign: "center",
      fontSize: "100px",
      padding: "10px",
      position: "relative"
    });
    header.add("div", 0, `${i + 1}/${length}`, {
      position: "absolute",
      top: "10px",
      fontSize: "30px",
      left: "10px"
    });
    const optionWrapper = wrapper.add("div", 0, 0, {
      border: "solid 1px #000",
      padding: "10px",
      gap: "10px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap"
    });
    let optionElems = [];
    for (const option of question.options) {
      const optionElem = optionWrapper.add("div", 0, option.meaning, {
        border: "solid 1px #000",
        flex: "1 0 30%",
        padding: "10px",
        boxSizing: "border-box",
        fontSize: "30px",
        textAlign: "center"
      });
      optionElem.option = option;
      optionElems.push(optionElem);
    }
    console.log(question, question.options, optionElems);
    const idx = await Promise.race(optionElems.map(async (op, i2) => {
      await op.once("click");
      console.log("clicked");
      return i2;
    }));
    console.log("index", idx);
    const chosen = optionElems[idx].option;
    const correct = chosen.meaning === question.question.meaning;
    for (let i2 = 0; i2 < optionElems.length; i2++) {
      const optionElem = optionElems[i2];
      optionElem.setInner(`${optionElem.option.word}:${optionElem.option.meaning}`);
      if (i2 === idx) {
        if (correct) {
          optionElem.style({ border: "solid 1px #0f0" });
        } else {
          optionElem.style({ border: "solid 1px #f00" });
        }
      } else if (optionElem.option.meaning === question.question.meaning) {
        optionElem.style({ border: "solid 1px #ff0" });
      }
    }
    responses.push({
      question,
      choice: idx,
      choiceWord: chosen,
      correct
    });
    const nextButton = wrapper.add("div", 0, "next", {
      border: "solid 1px #000",
      textAlign: "center",
      fontSize: "30px",
      padding: "10px"
    });
    await nextButton.once("click");
    wrapper.destroy();
  }
  const res = responses.compress();
  console.log(res);
  console.log(qid, res);
  await post(`/quiz/${qid}/responses`, res);
  topPage(body);
};
topPage(ELEM.fromElement(document.body));
CSS.init();
