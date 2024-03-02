import {ELEM,CSS} from "htmlgen";

const apiUrl = "http://localhost:5080/api";

ELEM.prototype.destroy = function(){
    let children = [...this.children];
    for(let child of children){
        child.remove();
    }
}

const get = async function(cmd){
    return await (await fetch(apiUrl+cmd)).json();
}

const routes = new Map();


const HISTORY_EMPTY = Symbol();
class History{
    stack = [];
    position = -1;
    push(fn,...args){
        this.stack.push([fn,args]);
    }
    next(){
        if(this.position === this.stack.length)return HISTORY_EMPTY
    }
    prev(){
    }
    pop(){
        if(this.stack.length === 0)return HISTORY_EMPTY;
        const [fn,args] = this.stack.pop();
        return fn(...args);
    }
}


const quizPage = async function(body,history){
    console.log("loading quiz page");
    body.add("H1",0,"Bitte wählen Sie das Einstellung für das Quiz aus");
    //body.add("");
    const destroy = () => body.destroy();
}


const startPage = async function(body,history){
    console.log(body);
    body.add("h1",0,"Bitte wählen Sie ein Quiz aus");
    // Liste der Quizze
    const listWrapper = body.add("div");
    const list = await get("/quizList");
    console.log(list);
    list.map(({name,id})=>{
        const item = listWrapper.add("div",{class:"itemButton"});
        item.add("span",0,name);
        const button = item.add("div",{class:"button"},"Weiter");
        item.on("click",()=>{
            destroy();
            quizPage(body);
        });
    });
    const destroy = () => body.destroy();
}

startPage(ELEM.fromElement(document.body),new History);

