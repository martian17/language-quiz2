// export const QuizType as const;

// export type compressedWordRecord;
// export type compressedQuiz;
// export type compressedResponses;
// export type wordEntry;
// export class WordRecord;
// export type question;
// export class Quiz;
// export type response;
// export class Responses extends Array<response>;

// this is just the start of my graph and set adventure
// in the future i will destroy it and make a ganz neue version



export const QuizType = {
    WordToMeaning: 0,
    MeaningToWord: 1,
} as const;

export type QuizType = typeof QuizType[keyof typeof QuizType];


// API types (compressed)

export type compressedWordRecord = {
    name: string;
    id: string;
    words: string[];
    meanings: string[];
    usecases: number[][];
    usecaseStrings: string[];
};

export type compressedQuiz = {
    questions: string[];
    options: string[][];
    type: QuizType;
    settings: any;
};

export type compressedResponses = {
    quiz: compressedQuiz;
    choices: number[];
};

// Internal types (decompressed)

export type wordEntry = {
    word: string;
    meaning: string;// meaning in english
    usecases: string[];
};

export class WordRecord{
    id!: string;
    name!: string;
    words: wordEntry[] = [];
    //private members
    wordIndex = new Map<string,wordEntry>;
    meaningIndex = new Map<string,wordEntry>;
    getByWord(word: string): wordEntry{
        return this.wordIndex.get(word)!;
    }
    getByMeaning(meaning: string): wordEntry{
        return this.meaningIndex.get(meaning)!;
    }
    static fromCompressed(record: compressedWordRecord): WordRecord{
        const length = record.words.length;
        const res = new WordRecord;
        res.name = record.name;
        res.id = record.id;
        for(let i = 0; i < length; i++){
            const word = {
                word: record.words[i],
                meaning: record.meanings[i],
                usecases: record.usecases[i].map(k=>record.usecaseStrings[k]),
            };
            res.words.push(word);
            res.wordIndex.set(word.word,word);
            res.meaningIndex.set(word.meaning,word);
        }
        return res;
    }
    compress(): compressedWordRecord{
        const usecaseIndices = new Map<string,number>;
        const res: compressedWordRecord = {
            name: this.name,
            id: this.id,
            words: this.words.map(w=>w.word),
            meanings: this.words.map(w=>w.meaning),
            usecases: [],
            usecaseStrings: [],
        }
        for(let {usecases} of this.words){
            let uc: number[] = [];
            for(let usecase of usecases){
                let idx;
                if((idx = usecaseIndices.get(usecase)) !== undefined){
                    uc.push(idx);
                    continue;
                }
                idx = res.usecaseStrings.length;
                res.usecaseStrings.push(usecase);
                usecaseIndices.set(usecase,idx);
                uc.push(idx);
            }
            res.usecases.push(uc);
        }
        return res;
    }
}


export type question = {
    question: wordEntry;
    options: wordEntry[];
};


export class Quiz{
    settings: any;
    type!: QuizType;
    questions: question[] = [];
    wordRecord!: WordRecord;
    static fromCompressed(quiz: compressedQuiz, wordRecord: WordRecord): Quiz{
        const res = new Quiz;
        console.log(quiz);
        res.settings = quiz.settings;
        res.type = quiz.type;
        for(let i = 0; i < quiz.questions.length; i++){
            const question: string = quiz.questions[i];
            const options: string[] = quiz.options[i];
            res.questions.push({
                question: wordRecord.getByWord(question),
                options: options.map(op=>wordRecord.getByWord(op)),
            });

        }
        res.wordRecord = wordRecord;
        return res;
    }
    compress(): compressedQuiz{
        const res: compressedQuiz = {
            type: this.type,
            questions: this.questions.map(q=>q.question.word),
            options: this.questions.map(q=>q.options.map(op=>op.word)),
            settings: this.settings,
        }
        return res;
    }
}


export type response = {
    question: question;
    choice: number;
    choiceWord: wordEntry;
    correct: boolean;
};

export class Responses extends Array<response>{
    quiz!: Quiz;
    static fromCompressed(resps: compressedResponses, wordRecord: WordRecord): Responses{
        console.log(resps,wordRecord);
        let quiz = Quiz.fromCompressed(resps.quiz,wordRecord);
        let res = new Responses;
        res.quiz = quiz;
        for(let i = 0; i < resps.choices.length; i++){
            const response = {
                question: quiz.questions[i],
                choice: resps.choices[i],
                choiceWord: quiz.questions[i].options[resps.choices[i]],
                correct: true,
            }
            if(quiz.type === QuizType.WordToMeaning){
                response.correct = response.question.question.meaning === response.choiceWord.meaning;
            }else if(quiz.type === QuizType.MeaningToWord){
                response.correct = response.question.question.word === response.choiceWord.word;
            }
            res.push(response);
        }
        return res;
    }
    compress(){
        console.log(this.quiz);
        const res: compressedResponses = {
            quiz: this.quiz.compress(),
            choices: this.map(r=>r.choice),
        };
        return res;
    }
}

