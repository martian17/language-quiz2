import {stdout} from "process";

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
    for(let i = 0; i < cl; i++){
        for(let j = 0; j < rl; j++){
            const idx = i*rl+j;
            process.stdout.write(arr[idx]+" ");
        }
        process.stdout.write("\n");
    }
    return arr.at(-1);
};

console.log(editDistance("monkey","money"));


