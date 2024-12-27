import {ELEM,CSS} from "htmlgen";

const apiUrl = "http://localhost:5080/api";

ELEM.prototype.destroy = function(){
    let children = [...this.children];
    for(let child of children){
        child.remove();
    }
}

export const get = async function(path){
    return await (await fetch(apiUrl+path)).json().catch(e=>"");
};

export const post = async function(path,body){
    return await (await fetch(apiUrl+path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })).json().catch(e=>"");
};

export const addBus = function(cls){
    cls.prototype.getBus = function(){
        if(!this.bus){
            this.bus = new Map;
        }
        return this.bus;
    }
    cls.prototype.on = function(evt,cb){
        const bus = this.getBus();
        if(!bus.has(evt)){
            bus.set(evt,new Set);
        }
        this.bus.get(evt).add(cb);
    }
    cls.prototype.off = function(evt,cb){
        const bus = this.getBus();
        if(!bus.has(evt)){
            console.log("Event DNE");
            return;
        }
        const set = this.bus.get("evt");
        if(!set.has(cb)){
            console.log("Handler DNE");
        }
        set.delete(cb);
    }
    cls.prototype.emit = function(evt,...args){
        const bus = this.getBus();
        const cbs = bus.get(evt);
        if(!cbs)return false;
        for(let cb of cbs){
            cb(...args);
        }
    }
    cls.prototype.once = function(evt){
        return new Promise(res=>{
            let cb;
            cls.on(evt,cb = (val)=>{
                cls.off(cb);
                res(val);
            });
        });
    }
}

export const zip = function*(...args){
    let baseArr = [];
    for(let i = 0; i < args[0].length; i++){
        for(let j = 0; j < args.length; j++){
            baseArr[j] = args[j][i];
        }
        yield baseArr;
    }
}

export const newarr = function(n){
    const arr = [];
    for(let i = 0; i < n; i++){
        arr.push(n);
    }
    return arr;
}

export const editDistance = function(a,b){
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
