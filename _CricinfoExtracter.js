// npm install minimist
// npm install axios
// npm install jsdom
// npm install excel4node
// npm install pdf-lib

//  node .\_CricinfoExtracter.js --excel=Worldcup.csv --dataFolder=Worldcup --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results

// getquerySelectorAll will always give output in array
    let minimist = require("minimist");
    let axios = require("axios");
    let jsdom = require("jsdom");
    let  excel = require("excel4node");
    let pdf = require("pdf-lib");
    let fs = require("fs");
    let path = require("path");
//down html use AXIOS===
    let args = minimist(process.argv);
    console.log(args.source);
    console.log(args.excel);
    let responseKaPromise = axios.get(args.source);
    responseKaPromise.then(function(response){
    let html = response.data;
    // console.log(html);
    
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    // let matchInfoDivs = document.querySelectorAll("div.match-info");
    


let matches = [];


let matchScoreDivs = document.querySelectorAll("div.match-score-block");


    for(let i = 0; i<matchScoreDivs.length; i++){
       let match={
        t1: "",
        t2: " ",
        t1s: "",
        t2s:"",
        result:""
     };
    let namePs = matchScoreDivs[i].querySelectorAll("p.name");
    match.t1 = namePs[0].textContent;
    match.t2 = namePs[1].textContent;

    let scoreSpans = matchScoreDivs[i].querySelectorAll("span.score");
    if(scoreSpans.length == 1){
         match.t1s = scoreSpans[0].textContent;
    }
    else if(scoreSpans.length == 2){
        match.t1s = scoreSpans[0].textContent;
        match.t2s = scoreSpans[1].textContent;
    }
    else{
        match.t1s = " ";
        match.t2s=" ";

    }

    let spanResult = matchScoreDivs[i].querySelector("div.status-text>span");
    match.result = spanResult.textContent;
    
    matches.push(match);


    }
    console.log(matches);
    
    //     // console.log(i);
    
// }
//     // to write JSO file or to save JSO file you have to convert it to JSON;

//     // console.log(matches[0]);
    let matchesJSON = JSON.stringify(matches);
    fs.writeFileSync("matches.json",matchesJSON,"utf-8");

//     // DAY2

    let teams = [];
    for(let i = 0; i<matches.length; i++){
        populateTeams(teams, matches[i]);
}
  console.log(teams);

    for(let i = 0; i<matches.length; i++){
        // populateTeams(teams, matches[i]);
        putMatchInAppropriateTeam(teams, matches[i])
    }
    console.log(teams);
})    
    // console.log(JSON.stringify(teams));
    let teamsJSON = JSON.stringify(teams);
    fs.writeFileSync("teams.json", teamsJSON,"utf-8");

//     createExelFile(teams);
//     createFolders(teams);



// }).catch(function(err){
//     console.log(err);
// })

    function populateTeams(teams, match){
        let t1idx = -1;
        for(let i = 0; i < teams.length; i++){
            if(teams[i].name == match.t1){
                t1idx = i;
                break;
            }
        }
        if(t1idx == -1){
            // teams[i].push({

//             // })
        let   team={
                name: match.t1,
                matches: []

            };
            teams.push(team);
        }

        
        let t2idx = -1;
        for(let i = 0; i< teams.length; i++){
            if(teams[i].name == match.t2){
                t2idx = i;
                break;
            }
            
        }
        if(t2idx == -1){
            let team = {
                name: match.t2,
                matches:[]

            }
            teams.push(team);
        }    
    }

    function putMatchInAppropriateTeam(teams, match){
        let t1idx = -1;
        for(let i = 0; i< teams.length; i++){
            if(teams[i].name == match.t1){
                t1idx = i;
                break;
            }
        }
        let team1 = teams[t1idx];
        team1.matches.push({
            vs:match.t2,
            selfScore: match.t1s,
            oppScore:match.t2s,
            result:match.result
        });

        let t2idx = -1;
        for(let i = 0; i< teams.length; i++){
            if(teams[i].name == match.t2){
                t2idx = i;
                break;
            }
        }
        let team2 = teams[t2idx];
        team2.matches.push({
            vs:match.t1,
            selfScore:match.t2s,
            oppScore:match.t1s,
            result:match.result


        })



}
// node .\_CricinfoExtracter.js --excel=Worldcup.csv --dataFolder=Worldcup --source=https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results

//     function createExelFile(teams){
//         let wb = new excel.Workbook();

//         for(let i = 0; i<teams.length; i++){
//             let sheet = wb.addWorksheet(teams[i].name);
//             sheet.cell(1,1).string("Vs");
//             sheet.cell(1,2).string("Self Score");
//             sheet.cell(1,3).string("Opp Score");
//             sheet.cell(1,4).string("Result");
        
//         for(let j = 0; j< teams[i].matches.length; j++){
//             sheet.cell(2 + j,1).string(teams[i].matches[j].vs);
//             sheet.cell(2+j,2).string(teams[i].matches[j].selfScore);
//             sheet.cell(2+j,3).string(teams[i].matches[j].oppScore);
//             sheet.cell(2+j,4).string(teams[i].matches[j].result);
            

//         }

//     }
//     wb.write(args.excel);

//     }

//     function createFolders(teams){
//         fs.mkdirSync(args.dataFolder)
//         for(let i = 0; i<teams.length; i++){
//             let teamFn = path.join(args.dataFolder,teams[i].name);
//             // console.log(teamFn);
//             fs.mkdirSync(teamFn);

//             for(let j = 0; j<teams[i].matches.length;j++){
//                 let matchFileName = path.join(teamFn, teams[i].matches[j].vs +".pdf");
//                 createScoreCard(teams[i].name, teams[i].matches[j], matchFileName);
        
        
//             }

//         }

//     }

//     function createScoreCard(teamsName, match, matchFileName){
//         let t1 = teamsName;
//         let t2 = match.vs;
//         let t1s = match.selfScore;
//         let t2s = match.oppScore;
//         let result = match.result;

//         let bytesOfTemplate = fs.readFileSync("Template.pdf");
//         let pdfdockaPromise = pdf.PDFDocument.load(bytesOfTemplate);
//         pdfdockaPromise.then(function(pdfdoc){
//             let page = pdfdoc.getPage(0);
            
//             page.drawText(t1,{
//                 x:320,
//                 y:720,
//                 size:20
//             });

//             page.drawText(t2,{
//                 x:320,
//                 y:685,
//                 size:20
//             });

//             page.drawText(t1s,{
//                 x:320,
//                 y:647,
//                 size:20
//             });

//             page.drawText(t2s,{
//                 x:320,
//                 y:617,
//                 size:20
//             });


//             page.drawText(result,{
//                 x:320,
//                 y:593,
//                 size:20
//             });


            

//             let finalPDFByteskaPromise = pdfdoc.save();
//             finalPDFByteskaPromise.then(function(finalPDFBytes){
//                 fs.writeFileSync(matchFileName,finalPDFBytes);
                
//             })
//         })

//     }