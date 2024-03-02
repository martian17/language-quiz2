import {ELEM} from "htmlgen";

ELEM.prototype.getBus = function(){
    if(!this.bus){
        this.bus = new Map;
    }
    return this.bus;
};

ELEM.prototype.on = function(evt,cb0){
    const bus = this.getBus();
    if(!bus.has(evt)){
        bus.set(evt,new Map);
    }
    const cb1 = (...vals)=>{
        if(this.disabled)return;
        cb0(...vals);
    };
    this.bus.get(evt).set(cb0,cb1);
    if(evt[0] !== "_"){
        this.e.addEventListener(evt,cb1);
    }
    return cb0;
};

ELEM.prototype.off = function(evt,cb0){
    const bus = this.getBus();
    if(!bus.has(evt)){
        console.log("Event DNE");
        return cb0;
    }
    const map = this.bus.get("evt");
    if(!map.has(cb0)){
        console.log("Handler DNE");
    }
    if(evt[0] !== "_")this.e.removeEventListener(map.get(cb0));
    map.delete(cb0);
    return cb0;
};

ELEM.prototype.emit = function(evt,...args){
    const bus = this.getBus();
    const cbs = bus.get(evt);
    if(!cbs)return false;
    for(let [cb0,cb1] of cbs){
        cb1(...args);
    }
};

ELEM.prototype.once = function(evt){
    return new Promise(res=>{
        let cb;
        this.on(evt,cb = (val)=>{
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
    set: function disabled(val) {
        val = !!val;
        this._disabled = val;
        if(val === true){
            this.classList.add("disabled");
        }else{
            this.classList.remove("disabled");
        }
    }
});

// Mathematicians behold, an identity method!
ELEM.prototype.I = function(cb){
    cb(I);
    return this;
};

ELEM.prototype.T = function(cb){
    return cb(this);
}


// ELEM.prototype.
// 
// ELEM.prototype.on = function(evt, cb){
//     this.e.addEventListener(evt,cb);
//     return cb;
// }
// on(evt: string, cb: Callback){
//     this.e.addEventListener(evt,cb);
//     return cb;
// }
// off(evt: string, cb: Callback){
//     this.e.removeEventListener(evt,cb);
//     return cb;
// }
// 
// 
// once(evt: string){
//     let that = this;
//     let cbs: Callback[] = [];
//     //console.log(evt,arguments);
//     for(let i = 1; i < arguments.length; i++){
//         let cb = arguments[i];
//         let evtfunc = function(cb: Callback, e: any){
//             for(let i = 0; i < cbs.length; i++){
//                 that.e.removeEventListener(evt,cbs[i]);
//             }
//             cbs = [];
//             cb(e);
//         }.bind(null,cb);
//         cbs.push(evtfunc);
//         this.e.addEventListener(evt,evtfunc);
//     }
//     return {
//         remove: function(){
//             for(let i = 0; i < cbs.length; i++){
//                 that.e.removeEventListener(evt,cbs[i]);
//             }
//         }
//     };
// }
// 
