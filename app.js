const express = require('express');
const dbData = require('./firebase')

// const partialPath = path.join(__dirname, "/templates/partials");


const app = express()
app.use(express.urlencoded());
app.use(express.json());

/*
    chat states
    0 - waiting for "data message"
    1 - waiting for without oxygen
    2 - waiting for with oxygen
    3 - waiting for icu witout ventilator
    4 - waiting for icu with ventilator
    5 - waiting for confirmation
*/
let replies = ['',
    'beds *WITHOUT* Oxygen:',
    'beds with Oxygen:',
    '*ICU* beds *WITHOUT* Ventilator:',
    '*ICU* beds with Ventilator:',
    ''
]
//TODO
//fetch the following from database
//hospital's whatsapp number into array numbers
//total number of beds in dataMax, stored in following manner datamax['+91 88666 69219'][1] = without oxygen
//1,2,3,4 for each type of bed
// let numbers = ['+91 88666 69219', 'Asmita', 'Ali']

// dbData.getDataByNo("+918866669219").then((data)=>{
//     console.log("data",data)
// }).catch((e)=>{
//     console.log("errroo occured",e);
// })

let dataMax = {};

let chatState = {};
let data = {};
// for (let n of numbers) {
//     //console.log(n);
//     chatState[n] = 0;
//     data[n] = {
//         1: -1,
//         2: -1,
//         3: -1,
//         4: -1
//     }
    //TODO remove this initialisation
//     dataMax[n] = {
//         1: 100,
//         2: 100,
//         3: 100,
//         4: 100
//     }
// }

//console.log(chatState);
console.log(data);
console.log(dataMax);
//console.log(replies);

app.post('/reply', function(req, res) {
    console.log(req.body.sender);
    console.log(req.body.message);
    //var message = req.body.message;
    var num = req.body.sender.replace(/\s/g, '');
    var err = 0;
    
    dbData.getDataByNo(num).then((da)=>{
        console.log("data",da);
        var state = chatState[num];
        if (req.body.message.toLowerCase() === 'data') {
            state = 1;
            dataMax[num] = {};
            dataMax[num][1] = parseInt(da[0]['withoutOxygen']);
            dataMax[num][2] = parseInt(da[0]['oxygenBed']);
            dataMax[num][3] = parseInt(da[0]['icuBeds']);
            dataMax[num][4] = parseInt(da[0]['icuVentilatorBeds']);
            data[num] = {
                id: da[0]['id'],
                1: -1,
                2: -1,
                3: -1,
                4: -1
            }
        } else if (!isNaN(req.body.message)) {
            if (state >= 1 && state < 5) {
                if (+req.body.message <= dataMax[num][state] && +req.body.message >= 0) {
                    data[num][state] = +req.body.message;
                    console.log(data);
                    state += 1;
                }
            }
            if (state === 5) {
                replies[5] = "You have entered the following available data" + "\n" +
                    replies[1] + data[num][1].toString() + "\n" +
                    replies[2] + data[num][2].toString() + "\n" +
                    replies[3] + data[num][3].toString() + "\n" +
                    replies[4] + data[num][4].toString() + "\n" +
                    "\nPlease send yes to confirm"

            }
        } else if (state === 5 && (req.body.message.toLowerCase() === 'yes' || req.body.message.toLowerCase() === 'y')) {
            state = 6;
        } else if (state === 5 && (req.body.message.toLowerCase() === 'no' || req.body.message.toLowerCase() === 'n')) {
            state = 1;
        } else {
            err = 1;
        }

        chatState[num] = state;

        if (err > 0) {
            res.json({
                "reply": "Please enter a valid response"
            });
        } else {
            if (state === 6) {
                //TODO upload data to server and send appropriate response
                var temp = data[num];
                dbData.updateDataById(temp).then((da)=>{
                    res.json({
                        "reply": "Data updated"
                    });
                    
                }).catch((e)=>{
                    console.log("errroo occured",e);
                    res.json({
                        "reply": "Server Error"
                    });
                })
            } else {
                var r;
                if (state === 5)
                    r = replies[state];
                else
                    r = "Please enter number of available " + replies[state];
                res.json({
                    "reply": r
                });
            }
        }
    }).catch((e)=>{
        console.log("errroo occured",e);
        res.json({
            "reply": "Unregistered number"
        });
    })
})


app.listen(process.env.PORT || 3005, () => {
    console.log("app is running on port");
})