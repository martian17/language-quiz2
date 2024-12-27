import * as M_express from "express";
const express = M_express.default;
import {promises as fs} from "fs";
const app = express();

app.use(express.json());

const readJsonFile = async function(path,def){
    let val;
    try{
        return JSON.parse(val=(await fs.readFile(path)+""));
    }catch(err){
        if(!def)throw err;
        let defstr = JSON.stringify(def);
        let result = JSON.parse(defstr);
        if(val !== "" && val !== undefined){
            const patharr = path.split("/");
            await fs.rename(path,patharr.slice(0,-1).join("/")+`/broken-${patharr.at(-1)}-${crypto.randomUUID()}`);
        }
        await fs.writeFile(path,defstr);
        return result;
    }
}

const respRecord = {
    data: await readJsonFile("./backend/data/responses.json",[]),// type array
    async save(){
        await fs.writeFile("./backend/data/responses.json",JSON.stringify(this.data));
    },
    async put(uid,qid,result){
        const ts = Date.now();
        this.data.push({
            uid,qid,result,ts
        })
        this.save();
    },
    get(uid,qid){
        return this.data.filter(d => 
            d.uid === uid &&
            d.qid === qid
        );
    },
};

const completionStateRecord = {
    data: await readJsonFile("./backend/data/completionStates.json",{}),// type object
    async save(){
        await fs.writeFile("./backend/data/completionStates.json",JSON.stringify(this.data));
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

const compressWordRecord = function(words0){
    const words = [];
    const meanings = [];
    const usecases = [];
    const usecaseStrings = [];
    const usecaseMap = new Map;
    for(let [word,meaning,{context: localUsecases}] of words0){
        words.push(word);
        meanings.push(meaning);
        let ucs = [];
        for(let uc of localUsecases){
            let ucid = usecaseMap.get(uc);
            if(ucid !== undefined){
                ucs.push(ucid);
                continue;
            }
            ucid = usecaseStrings.length;
            ucs.push(ucid);
            usecaseMap.set(uc,ucid);
            usecaseStrings.push(uc);
        }
        usecases.push(ucs);
    }
    return {
        words,
        meanings,
        usecases,
        usecaseStrings
    };
};

const defaultQuizList = [
    {
        name: "Essen in Dungeon",
        id: "9cac9db4-231d-4db4-89bb-07739c395f20",
        data: compressWordRecord(await readJsonFile("./backend/data/dungeon.json")),
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
    const qid = req.params.qid;
    const result = req.body;
    // result: list[q,resp]
    const uid = defaultUid;
    respRecord.put(uid,qid,result);
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



