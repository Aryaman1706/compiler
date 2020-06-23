#! /usr/bin/env node

"use strict";

/*
    stdin -> 0
    stdout -> 1
    stderr -> 2
*/ 

var childProc = require("child_process");
var fs = require('fs');
var path = require('path');

let fileName = "1";

var compileCpp = () => {
    var compile = childProc.spawn('g++', ['-o', `${fileName}.exe`, `${fileName}.cpp`]);
    compile.stderr.pipe(fs.createWriteStream(path.join(__dirname, '/out.txt')));
    compile.on('close', (code)=>{
        console.log("compile code ",code);
        if(code === 0){
            var run = childProc.spawn(`./${fileName}.exe`,[]);
            run.stderr.pipe(fs.createWriteStream(path.join(__dirname, '/out.txt')));
            let input = fs.readFileSync(path.join(__dirname, '/in.txt'))
            console.log(input.toString());
            run.stdin.write(input);
            run.stdin.end();
            run.stdout.pipe(fs.createWriteStream(path.join(__dirname, '/out.txt')));

            run.on('close', (code)=>{
                if(code === 0){
                    console.log("successful :>");
                }else{
                    console.log("unsuccessful :<");
                }
            });
        }else{
            process.stdout.write(fs.readFileSync(path.join(__dirname, '/out.txt')));
        }
    })
};
compileCpp();