import {ELEM, CSS} from "htmlgen";
import {} from "./extensions.js";
import {get, post} from "./util.js";
import {createQuiz} from "./quizService";
import {QuizType, Responses} from "../common/typeHandlers";

CSS.add(`
body{
    background-color: #fff;
}
`);

//testing the api

console.log(await get("/quizList"));
let ctx = {
    quizType: QuizType.WordToMeaning,
    quizMode: "repeat",
    quizLength: 2,
    optionSize: 9,
}
console.log(await createQuiz("9cac9db4-231d-4db4-89bb-07739c395f20",ctx));

const topPage = async function(body){
    body.destroy();
    body.add("H1",0,"Choose the quiz");
    const listWrapper = body.add("div");
    for(let {name,id} of await get("/quizList")){
        const item = listWrapper.add("div",0,name,{
            border: "solid 1px #000",
            padding: "10px",
            margin: "20px",
        });
        item.on("click",()=>{
            ctx.qid = id;
            quizPage(body);
        });
    }
}

const quizPage = async function(body){
    body.destroy();
    const wrapper = body.add("div",0,0,{
        border: "solid 1px #000",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "20px",
    });
    const qid = ctx.qid;
    const responses = new Responses;
    const quiz = await createQuiz(qid,ctx);
    responses.quiz= quiz;

    const length = quiz.questions.length;
    for(let i = 0; i < length; i++){
        const question = quiz.questions[i];
        const header = wrapper.add("div",0,question.question.word,{
            border: "solid 1px #000",
            textAlign: "center",
            fontSize: "100px",
            padding: "10px",
            position: "relative",
        });
        header.add("div",0,`${i+1}/${length}`,{
            position: "absolute",
            top: "10px",
            fontSize: "30px",
            left: "10px",
        });

        const optionWrapper = wrapper.add("div",0,0,{
            border: "solid 1px #000",
            padding: "10px",
            gap: "10px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
        });
        let optionElems = [];
        for(const option of question.options){
            const optionElem = optionWrapper.add("div",0,option.meaning,{
                border: "solid 1px #000",
                flex: "1 0 30%",
                padding: "10px",
                boxSizing: "border-box",
                fontSize: "30px",
                textAlign: "center",
            });
            optionElem.option = option;
            optionElems.push(optionElem);
        }
        console.log(question,question.options,optionElems);
        const idx = await Promise.race(optionElems.map(async (op,i)=>{
            await op.once("click");
            console.log("clicked");
            return i;
        }));
        console.log("index",idx);
        const chosen = optionElems[idx].option;
        const correct = chosen.meaning === question.question.meaning;
        for(let i = 0; i < optionElems.length; i++){
            const optionElem = optionElems[i];
            optionElem.setInner(`${optionElem.option.word}:${optionElem.option.meaning}`);
            if(i === idx){
                if(correct){
                    optionElem.style({border:"solid 1px #0f0"});
                }else{
                    optionElem.style({border:"solid 1px #f00"});
                }
            }else if(optionElem.option.meaning === question.question.meaning){
                    optionElem.style({border:"solid 1px #ff0"});
            }
        }
        responses.push({
            question,
            choice: idx,
            choiceWord: chosen,
            correct,
        });
        const nextButton = wrapper.add("div",0,"next",{
            border: "solid 1px #000",
            textAlign: "center",
            fontSize: "30px",
            padding: "10px",
        });
        await nextButton.once("click");
        wrapper.destroy();
    }
    //finally send the response to the server
    const res = responses.compress();
    console.log(res);
    console.log(qid,res);
    await post(`/quiz/${qid}/responses`,res);
    topPage(body);
}

topPage(ELEM.fromElement(document.body))

CSS.init();



// window.addEventListener("popState",(e)=>{
//     const {state} = e;
// });
// 
// const normalizePath = function(path){
//     let res = "";
//     for(let i = 0; i < path.length; i++){
//         let c = path[i];
//         if(c === "/"){
//             if(path[i-1] === "/")continue;
//             res += "/";
//         }else{
//             res += c;
//         }
//     }
//     if(res.at(-1) === "/")res = res.slice(0,-1);
//     if(res === "")res = "/";
//     return res;
// };
// 
// 
// const body = ELEM.from(document.body);
// 
// class Router{
//     routeMap = new Map;
//     add(path,loader){
//         path = normalizePath(path);
//         this.routeMap.set(path,loader);
//     }
//     load(path,args){
//         const loader = this.routeMap.get(path);
//         loader(body);
//     }
// }
// 
// const router = new Router;
// 
// const loadCurrent = function(){
//     const url = new URL(window.location);
//     const path = url.pathname;
//     if(path === "/")path = "/topPage";
//     router.load(path);
// }
// 
// 
// class History{
//     stack = [];
//     idx = -1;
//     add(itme){
//         this.stack[++this.idx] = item;
//         this.stack.length = this.idx+1;
//     }
//     weiter(){
//         if(!this.stack[this.idx+1]){
//             return undefined;
//         }
//         return this.stack[++this.idx]
//     }
//     zuruck(){
//         if(this.idx <= 0){
//             return undefined;
//         }
//         return this.stack[--this.idx];
//     }
//     clear(){
//         this.stck = [];
//         this.idx = -1;
//     }
// }
// 
// 
// 
// 
// const topPage = async function(body){
//     body.destroy();
//     body.add("H1",0,"Quiz Währen");
//     const listWrapper = body.add("div");
//     let disabled = false;
//     for(let {name,id} of await get("/quizList")){
//         const item = listWrapper.add("div",{class:"diamond"});
//         item.add("h2",0,name);
//         item.add("span",0,"Weiter->");
//         item.on("click",()=>{
//             if(disabled)return;
//             disabled = true;
//             ctx.qid = id;
//             ctx.qname = name;
//             ctx.history.add(topPage);
//             quizTop(body);
//         });
//     }
// }
// router.add("/top",topPage);
// 
// const repeat = function(str,n){
//     let res = "";
//     for(let i = 0; i < n; i++){
//         res += str;
//     }
//     return res;
// }
// 
// const quizTop = async function(body){
//     body.destroy();
//     body.add("H1",0,`Beginnen ${ctx.qname}`);
//     body.add("p",0,repeat("lorem ipsum ",20));
//     let disabled = false;
//     // control wrapper
//     const cw = body.add("div");
//     cw.add("div",{class:"diamond"},"Zuruck").on("click",()=>{
//         if(disabled)return;
//         let page = ctx.history.zuruck();
//         if(!page)return;
//         disabled = true;
//         page(body);
//     });
//     cw.add("div",{class:"diamond"},"Weiter").on("click",()=>{
//         if(disabled)return;
//         disabled = true;
//         ctx.history.add(quizTop);
//         quizMain(body);
//     });
// };
// router.add("/quizTop",quizTop);
// 
// 
// 
// class Counter extends ELEM{
//     cap = 0;
//     n = 0;
//     create(cap){
//         const c = new Counter;
//         c.cap = cap;
//         c.e = document.createElement("div");
//         c.e.classList.add("pie");
//         c.label = c.add("div");
//         c.setValue(0);
//         return c;
//     }
//     setValue(n){
//         const {cap} = this;
//         this.n = n;
//         const p = (n/cap)*100;
//         this.label.setInner(`${n}/${this.cap}`);
//         this.style({background:`background: conic-gradient(red 0% ${p}%, #0000 ${p}%);`});
//     }
// }
// 
// 
// 
// 
// // const quizMain = async function(body){
// //     body.destroy();
// //     let ui = {};
// //     {
// //         ui.wrapper = body.add("div",{class: "diamond quiz-wrapper"});
// //         ui.wrapper.add("div",{class: "top"});
// //     }
// // }
// 
// 
// const quizMain = async function(body){
//     // local enums
//     const HIDDEN = 0;
//     const CORRECT = 1;
//     const WRONG = 2;
// 
//     body.destroy();
//     let e_wrapper = body.add("div",{class:"diamond quiz-wrapper"});
//     e_wrapper.add("div",{class:"top"},`${ctx.qname}`);
//     let e_counter = e_wrapper.add(QuizCounter.create());
//     let e_q = e_wrapper.add("div");
//     let icons = e_wrapper.add("div",{class:"icon-wrapper"},0,{position:"relative"}).T(it=>{
//         const correct = it.add("div",{class:"icon-correct"});
//         const wrong = it.add("div",{class:"icon-wrong"});
//         return {
//             set state(state){
//                 correct.style({display: state === CORRECT ? "block" : "hidden"});
//                 wrong.style({display: state === WRONG ? "block" : "hidden"});
//             }
//         }
//     });
//     let o_options = e_wrapper.add("div").T(it=>{
//         let l_options;
//         return {
//             newQuestion({question,options}){
//                 it.destroy();
//                 l_options = [];
//                 for(let option of options){
//                     
//                     const e_opt = it.add("div",{class:"option"}).I(
//                         it=>it.on("click",()=>{
//                             l_options.map(op=>op.select(choice));
//                             if(option === question){
//                                 icons.state = CORRECT;
//                             }else{
//                                 icons.state = WRONG;
//                             }
//                         })
//                     );
//                     l_options.push({
//                         select(choice){
//                             e_opt.disabled = true;
//                             if(option === question){
//                                 e_opt.classList.add("correct");
//                             }else if(option === choice){
//                                 e_opt.classList.add("wrong");
//                             }else{
//                                 e_opt.classList.add("unselected");
//                             }
//                         }
//                     });
//                 }
//             },
//             showAnswer(){
//             },
//         }
//     });
// 
//     let e_next = e_wrapper.add("div",0,"Weiter");
//     let e_prev = e_wrapper.add("div",0,"Zuruck").I(it=>it.disabled = true);
// 
//     const quiz = createQuiz(ctx.qid,ctx);
//     const responseArray = [];
//     const response = {
//         words: quiz.map(v=>v.question),
//         options: quiz.map(v=>v.options),
//         responses: responseArray
//     };
// 
//     
//     for(let {question,options} of quiz){
//         for(let ans of options){
//             e_options.destroy();
//             let e_option = e_options.add("div",{class:"diamond"});
//             e_option.add("div",0,ctx.ansToQ.get(ans));
//             e_option.on("click",()=>{
// 
//             });
//         }
//     }
//     
//     const displayOptions = async function(){
//         
//     }
// }
// 
// const quizResult = function(body){
//     body.destroy();
//     body.add("h1","Ergebnis");
//     let disabled = false;
//     const cw = body.add("div");
//     cw.add("div",{class:"diamond"},"Weider versuchen",()=>{
//         if(disabled)return;
//         disabled = true;
//         ctx.history.push(quizResult);
//         quizTop(body);
//     });
//     cw.add("div",{class:"diamond"},"Zuruck",()=>{
//         if(disabled)return;
//         disabled = true;
//         ctx.history.push(quizResult);
//         topPage(body);
//     });
// }
// 
// 
// 
// 
// 
// 
// 
// 
// 
// // execution start
// const ctx = {
//     history: new History,
//     quizMode: "repeat",
// };
// 
// loadCurrent();
