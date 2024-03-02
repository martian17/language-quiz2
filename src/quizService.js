import {get, post, addBus} from "./util.js";



const zip = function*(...args){
    let baseArr = [];
    for(let i = 0; i < args[0].length; i++){
        for(let j = 0; j < args.length; j++){
            baseArr[j] = args[j][i];
        }
        yield baseArr;
    }
}

const newarr = function(n){
    const arr = [];
    for(let i = 0; i < n; i++){
        arr.push(n);
    }
    return arr;
}

const editDistance = function(a,b){
    const rl = a.length+1;
    const cl = b.length+1;
    const arr = newarr(rl*cl);
    for(let i = 0; i < rl; i++){
        arr[i] = i;
    }
    for(let i = 0; i < cl; i++){
        arr[rl*i] = i;
    }
    for(let bi = 1; bi < cl; bi++){
        for(let ai = 1; ai < rl; ai++){
            const idx = bi*rl+ai;
            const nn = arr[idx-rl];
            const ww = arr[idx-1];
            const nw = arr[idx-rl-1];
            if(a[ai-1] === b[bi-1]){
                arr[idx] = nw;
            }else{
                let mv = ww;
                if(nn < mv)mv = nn;
                if(nw < mv)mv = nw;
                arr[idx] = mv+1;
            }
        }
    }
    return arr.at(-1);
};

const similarityScore = function(a,b){
    const ed = editDistance(a,b)+1;// +1 is for when it is equal
    let modifier = 1;
    if(a[0].toLowerCase() === b[0].toLowerCase())modifier *= 2;
    if(a.at(-1).toLowerCase() === b.at(-1).toLowerCase())modifier *= 2;
    return (a.length+b.length)/ed*modifier;
};

const zipResponses = function(words,resps){
    let history = {};
    for(let [word] of words){
        history[word] = [];
    }
    for(let {words,responses} of resps){
        for(let [word,resp] of zip(words,responses)){
            history[word].push(resp);
        }
    }
    return Object.entries(history);
}

const getPositiveStreaks = function(verlauf){
    let streak = 0;
    for(let i = verlauf.length-1; i >= 0; i--){
        let val = verlauf[i];
        if(val === 0)break;
        if(val === 1)streak++;
    }
    return streak;
}

const getNegativeStreaks = function(verlauf){
    let streak = 0;
    for(let i = verlauf.length-1; i >= 0; i--){
        let val = verlauf[i];
        if(val === 0)break;
        if(val === 1)streak++;
    }
    return streak;
}


const verlaufToPriority = {
    repeat: function(word,verlauf){
        const positiveStreaks = getPositiveStreaks(verlauf);
        const negativeStreaks = getNegativeStreaks(verlauf);
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
    sweep(word,verlauf){
        const positiveStreaks = getPositiveStreaks(verlauf);
        const negativeStreaks = getNegativeStreaks(verlauf);
        let val = 0;
        // failed words first
        if(negativeStreaks){
            return negativeStreaks+20;
        }
        // untouched words next
        if(positiveSteaks < 3){
            return 3-positiveStreaks;
        }
        // already mastered last
        return -1;
    },
    random(word,verlauf){
        const positiveStreaks = getPositiveStreaks(verlauf);
        if(positiveStreaks < 3){
            return 1;
        }
        return -1;
    }
};

const noisySort = function(cb,noiseLevel){
    return function(a,b){
        if(a === b || Math.random() < noiseLevel){
            return Math.random()-0.5;
        }
        return cb(a,b);
    };
};


const createOptions = function(word,words){
    console.log(words);
    let a1 = [];
    for(let [w1] of words){
        if(w1 === word)continue;
        const s = similarityScore(word,w1);
        a1.push([w1,s]);
    }
    const randomness = 0.1;
    a1 = a1.sort(noisySort((a,b)=>{
        return b[1]-a[1];
    },randomness)).map(v=>v[0]);
    let options = a1.slice(0,3);
    options.push(word);
    options = options.sort(()=>Math.random()>0.5).map(w=>w);
    return options;
};


export const createQuiz = async function(qid,ctx){
    // fetch necessary information
    const words = (await get(`/quiz/${qid}`)).data;
    const resps = await get(`/quiz/${qid}/responses`);
    console.log(words);
    console.log(resps);
    ctx.ansToQ = new Map(words);
    ctx.qToAns = new Map(words.map(([a,b])=>[b,a]));
    const verlaufs = zipResponses(words,resps);
    const chosen = verlaufs.sort(([w1,v1],[w2,v2])=>{
        const p1 = verlaufToPriority[ctx.quizMode](w1,v1);
        const p2 = verlaufToPriority[ctx.quizMode](w2,v2);
        if(p1 === p2)return Math.random()-0.5;
        return p2-p1;
    }).map(([w,v])=>w).slice(0,ctx.quizLength);
    const answerMap = new Map(words);
    return chosen.map(w=>{
        return {
            question: w,
            options: createOptions(w,words)
        }
    });
};


