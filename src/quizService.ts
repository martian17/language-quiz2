// @ts-ignore: ignore lack of type def for the import
import {zip, newarr, editDistance, get, post, addBus} from "./util.js";
import {WordRecord, Quiz, Responses, compressedResponses, QuizType} from "../common/typeHandlers";



type sorter<T> = (a:T,b:T)=>number;

const noisySort = function<T>(cb: sorter<T>, noiseLevel: number): sorter<T>{
    return function(a,b){
        if(a === b || Math.random() < noiseLevel){
            return Math.random()-0.5;
        }
        return cb(a,b);
    };
}


const similarityScore = function(a: string, b: string): number{
    const ed = editDistance(a,b)+1;// +1 is for when it is equal
    let modifier = 1;
    if(a[0].toLowerCase() === b[0].toLowerCase())modifier *= 2;
    if(a.at(-1)!.toLowerCase() === b.at(-1)!.toLowerCase())modifier *= 2;
    return (a.length+b.length)/ed*modifier;
};


type historyMapper = (wordHistory: WordHistory)=>number

const wordHistoryToPriority: {[key: string]: historyMapper} = {
    repeat(wordHistory: WordHistory){
        const positiveStreaks = wordHistory.getPositiveStreaks();
        const negativeStreaks = wordHistory.getNegativeStreaks();
        let val = 0;
        // failed words first
        if(negativeStreaks){
            return negativeStreaks+20;
        }
        // words that are closest to completion next
        if(positiveStreaks < 3){
            return positiveStreaks;
        }
        // already mastered last
        return -1;
    },
    sweep(wordHistory: WordHistory){
        const positiveStreaks = wordHistory.getPositiveStreaks();
        const negativeStreaks = wordHistory.getNegativeStreaks();
        // failed words first
        if(negativeStreaks){
            return negativeStreaks+20;
        }
        // untouched words next
        if(positiveStreaks < 3){
            return 3-positiveStreaks;
        }
        // already mastered last
        return -1;
    },
    random(wordHistory: WordHistory){
        const positiveStreaks = wordHistory.getPositiveStreaks();
        if(positiveStreaks < 3){
            return 1;
        }
        return -1;
    }
};


class WordHistory extends Array<boolean>{
    getPositiveStreaks(){
        let streak = 0;
        for(let i = this.length-1; i >= 0; i--){
            let val = this[i];
            if(val === false)break;
            if(val === true)streak++;
        }
        return streak;
    }
    getNegativeStreaks(){
        let streak = 0;
        for(let i = this.length-1; i >= 0; i--){
            let val = this[i];
            if(val === true)break;
            if(val === false)streak++;
        }
        return streak;
    }
}

const tallyResponses = function(resps: Responses[], wordRecord: WordRecord, quizType: QuizType){
    let res = new Map<string,WordHistory>(wordRecord.words.map(w=>[w.word,new WordHistory]))
    for(let resp of resps){
        if(quizType !== undefined){
            if(resp.quiz.type !== quizType)continue;
        }
        for(let r of resp){
            const word = r.choiceWord.word;
            res.get(word)!.push(r.correct);
        }
    }
    return res;
}


const createOptions = function(word: string, words: string[], optionSize: number): string[]{
    let a1 = [];
    for(let w1 of words){
        if(w1 === word)continue;
        const s = similarityScore(word,w1);
        a1.push([w1,s]);
    }
    const randomness = 0.1;
    a1 = a1.sort(noisySort((a,b)=>{
        // @ts-ignore
        return b[1]-a[1];
    },randomness)).map(v=>v[0]);
    let options = a1.slice(0,optionSize-1) as string[];
    options.push(word);
    // @ts-ignore
    options = options.sort(()=>Math.random()>0.5).map(w=>w);
    return options;
};

export const createQuiz = async function(qid: string, ctx: any): Promise<Quiz> {
    const wordRecord = WordRecord.fromCompressed((await get(`/quiz/${qid}`)).data);
    const rawWords: string[] = wordRecord.words.map(w=>w.word);
    console.log(await get(`/quiz/${qid}/responses`));
    const resps = ((await get(`/quiz/${qid}/responses`)) as compressedResponses[]).map(compressed=>Responses.fromCompressed(compressed,wordRecord));
    const questions = [];
    // tally the responses to be able to count the correct streaks
    // sort the words depending on the importance
    const wordHistoryMap = tallyResponses(resps,wordRecord,ctx.quizType);
    const quizWords: string[] = wordRecord.words.map(w=>w.word).sort(noisySort((w1,w2)=>{
        const p1 = wordHistoryToPriority[ctx.quizMode]!(wordHistoryMap.get(w1) as WordHistory);
        const p2 = wordHistoryToPriority[ctx.quizMode]!(wordHistoryMap.get(w2) as WordHistory);
        return p2-p1;
    },0.5)).slice(0,ctx.quizLength);
    const quiz = new Quiz;
    quiz.settings = {
        quizMode: ctx.quizMode,
    }
    quiz.type = ctx.quizType;//QuizType.WordToMeaning;
    quiz.questions = quizWords.map(w=>({
        question: wordRecord.getByWord(w),
        options: createOptions(w,rawWords,ctx.optionSize).map(w=>wordRecord.getByWord(w))
    }));
    return quiz;
}


