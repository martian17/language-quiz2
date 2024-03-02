import {ELEM,CSS} from "htmlgen";

const apiUrl = "http://localhost:5080/api";

ELEM.prototype.destroy = function(){
    let children = [...this.children];
    for(let child of children){
        child.remove();
    }
}

export const get = async function(path){
    return await (await fetch(apiUrl+path)).json();
};

export const post = async function(path){
    return await (await fetch(apiUrl+path), {
        method: "POST"
    });
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
