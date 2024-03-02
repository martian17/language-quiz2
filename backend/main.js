import * as M_express from "express";
const express = M_express.default;
import {promises as fs} from "fs";
const app = express();

console.log(await fs.readFile("./data/responses.json"));
const respRecord = {
    data: JSON.parse(await fs.readFile("./data/responses.json")),// type array
    async save(){
        await fs.writeFile("./data/responses.json",this.data);
    },
    store(uid,qid,result){
        const ts = Date.now()
        
    },
    get(uid,qid){
        return this.data.filter(d => 
            d.uid === uid &&
            d.qid === qid
        );
    },
    put(uid,qid,response){// response is a list of []
        data.push({uid,qid,time:Date.now(),response});
    },
};

const completionStateRecord = {
    data: JSON.parse(await fs.readFile("./data/completionStates.json")),// type object
    async save(){
        await fs.writeFile("./data/completionStates.json",this.data);
    },
    store(uid,qid,result){
        const entry = this.data[uid+qid];
        for(let key in result){
            let res = result[key];
            if(res){
                entry[key]++;
            }else{
                entry[key] = 0;
            }
            entry[key] += result[key];
        }
    },
};

const defaultQuizList = [
    {
        name: "Essen in Dungeon",
        id: "9cac9db4-231d-4db4-89bb-07739c395f20",
        data: JSON.parse(await fs.readFile("./data/dungeon.json")),
    },
];

const defaultUid = "87b87c96-32e7-4c71-92fb-f86d2f6095df";

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.json());

app.get("/api/quizList",(req,res)=>{
    res.send(defaultQuizList.map(d=>{
        return {
            name: d.name,
            id: d.id
        }
    }));
});

app.get("/api/quiz/:qid",(req,res)=>{
    res.send(defaultQuizList.filter(q=>{
        return q.id === req.params.qid
    })[0]);
});

// quiz result type
/*
type QuizResult = {
    uid: string,
    qid: string,
    time: numner,
    response: {
        // design choice here attempts to compress the json data
        "words": string[],
        "responses": number[],
        // 0: wrong, 1:correct, 2: unanswered
        "options": string[][]
    }
}
*/

app.post("/api/quiz/:qid/responses",(req,res)=>{
    const qid = req.param.qid;
    const {result} = req.body;
    // result: list[q,resp]
    const uid = defaultUid;
    respRecord.store(uid,qid,result);
    res.send(200);
});

app.get("/api/quiz/:qid/responses",(req,res)=>{
    const qid = req.params.qid;
    const uid = defaultUid;
    res.send(respRecord.get(uid,qid));
});

app.listen(5080,()=>{
    console.log("Listening to 5080");
});



