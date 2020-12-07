var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
const dotenv = require('dotenv').config();

var cog = require('botbuilder-cognitiveservices');

const fetch = require('node-fetch');

const Bluebird = require('bluebird');
 
fetch.Promise = Bluebird;
const convert = require('xml-js');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
// Setup Restify Server
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

server.use((req, res, next) => {
    //if (!req.method === 'POST') { 
        next();
        console.log(JSON.stringify(req.headers));
    //}
    console.log('Hello Middleware');
    // add your POST only logic here
});
//console.log(server);
console.log(process.env.LuisAppId);

var useEmulator = (process.env.NODE_ENV == 'development');
var connector = useEmulator ? new builder.ChatConnector() : new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
   // openIdMetadata: process.env.BotOpenIdMetadata
});


// var connector = useEmulator ? new builder.ChatConnector({
//     appId: process.env['MicrosoftAppId'], //new param
//     appPassword: process.env['MicrosoftAppPassword']  //new param
// }) : new botbuilder_azure.BotServiceConnector({
// appId: process.env['MicrosoftAppId'],
// appPassword: process.env['MicrosoftAppPassword'],
// // stateEndpoint: process.env['BotStateEndpoint'],
// // openIdMetadata: process.env['BotOpenIdMetadata']
// });

// Listen for messages from users
server.post('/api/messages', connector.listen());
// i added

// connector.onTurnError = async (context, error) => {
//     // This check writes out errors to console log .vs. app insights.
//     // NOTE: In production environment, you should consider logging this to Azure
//     //       application insights.
//     console.error(`\n [onTurnError] unhandled error: ${ error }`);

//     // Send a trace activity, which will be displayed in Bot Framework Emulator
//     await context.sendTraceActivity(
//         'OnTurnError Trace',
//         `${ error }`,
//         'https://www.botframework.com/schemas/error',
//         'TurnError'
//     );

//     // Send a message to the user
//     await context.sendActivity('The bot encountered an error or bug.');
//     await context.sendActivity('To continue to run this bot, please fix the bot source code.');
//     // Clear out state
//     await conversationState.delete(context);
// };
// server.post('/api/messages', (req, res) => {
//     connector.processActivity(req, res, async (context) => {
//         await bot.run(context);
//     });
// });
// i ended
var bot = new builder.UniversalBot(connector);

// var bot = new builder.UniversalBot(connector,function(session){
//     session.send("Welcome to the ELP Bot.");
// });





var inMemoryStorage = new builder.MemoryBotStorage();
bot.set('storage', inMemoryStorage);

bot.on('conversationUpdate',(session,activity,message) => {
    console.log('Hey bot start!!')
    //session.send('Hey , Welcome to ELP Bot');
    //console.log('session.message.user.name = ' + session.message.user.name);
    if(session.membersAdded){
       session.membersAdded.forEach(function (identity) {
    if(identity.id === session.address.bot.id){
      // bot.beginDialog(session.address,'Welcome');
       //session.send(session.user.name)
       console.log(session);
       //session.send('this is welcome message')
       }
    });
   }
 })
 



var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);

var qnaRecognizer = new cog.QnAMakerRecognizer({
    knowledgeBaseId: 'f64f3006-9fdf-4cf8-94a2-f75563264996',
    subscriptionKey: '24c702e9-1239-4c9f-a268-c2ad197589fb'
});

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
//var intents = new builder.IntentDialog({ recognizers: [recognizer,qnaRecognizer] })

.matches('Greeting', (session) => {
    var name=session.message.address.user.name;
    
    //  var msg = new builder.Message(session);
    // msg.attachmentLayout(builder.AttachmentLayout.carousel)
    // msg.attachments([
    //     new builder.HeroCard(session)
    //         .title("Classic White T-Shirt")
    //         .subtitle("100% Soft and Luxurious Cotton")
    //         .text("Price is $25 and carried in sizes (S, M, L, and XL)")
    //         .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
    //         .buttons([
    //             builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
    //         ]),
    //     new builder.HeroCard(session)
    //         .title("Classic Gray T-Shirt")
    //         .subtitle("100% Soft and Luxurious Cotton")
    //         .text("Price is $25 and carried in sizes (S, M, L, and XL)")
    //         .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
    //         .buttons([
    //             builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
    //         ])
    // ]);
    // session.send(msg).endDialog();
//     var msg = new builder.Message(session)
//     .addAttachment({
//         contentType: "application/vnd.microsoft.card.adaptive",
//         content: {
//     "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
//     "type": "AdaptiveCard",
//     "version": "1.0",
//     "body": [
//         {
//             "type": "ColumnSet",
//             "columns": [
//                 {
//                     "type": "Column",
//                     "items": [
//                         {
//                             "type": "TextBlock",
//                             "weight": "bolder",
//                             "text": "Name"
//                         },
//                         {
//                             "type": "TextBlock",
//                             "separator":true,
//                             "text": "Apple"
//                         },{
//                             "type": "TextBlock",
//                             "separator":true,
//                             "text": "Kiwi"
//                         }
//                     ]
//                 },
//                 {
//                     "type": "Column",
//                     "items": [
//                         {
//                             "type": "TextBlock",
//                             "weight": "bolder",
//                             "text": "Tag"
//                         },
//                         {
//                             "type": "TextBlock",
//                             "separator":true,
//                             "text": "Fruit"
//                         },{
//                             "type": "TextBlock",
//                             "separator":true,
//                             "text": "Fruit"
//                         }
//                     ]
//                 },
//                 {
//                     "type": "Column",
//                     "items": [
//                         {
//                             "type": "TextBlock",
//                             "weight": "bolder",
//                             "text": "Price"
//                         },
//                         {
//                             "type": "TextBlock",
//                             "separator":true,
//                             "text": "2"
//                         },{
//                             "type": "TextBlock",
//                             "separator":true,
//                             "text": "1"
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// }
//     });
// session.send(msg);
// var itemsArray=[{
//             "type": "TextBlock",
//             "weight": "bolder",
//             "text": "Name"
//         },
//         {
//             "type": "TextBlock",
//             "separator":true,
//             "text": "Apple"
//         },{
//             "type": "TextBlock",
//             "separator":true,
//             "text": "Kiwi"
//         }
//     ];
//     var bodyArray=[
//         {
//             "type": "ColumnSet",
//             "columns": [
//                 {
//                     "type": "Column",
//                     "items": itemsArray
//                 }
                
//             ]
//         }
//     ]

var data= [
        {
            "id": 7,
            "email": "anujk@reqres.in",
            "first_name": "Anuj K",
            "last_name": "Lawson",
            "avatar": "https://reqres.in/img/faces/7-image.jpg"
        },
        {
            "id": 8,
            "email": "lindsay.ferguson@reqres.in",
            "first_name": "Lindsay",
            "last_name": "Ferguson",
            "avatar": "https://reqres.in/img/faces/8-image.jpg"
        },
        {
            "id": 9,
            "email": "tobias.funke@reqres.in",
            "first_name": "Tobias",
            "last_name": "Funke",
            "avatar": "https://reqres.in/img/faces/9-image.jpg"
        },
        {
            "id": 10,
            "email": "byron.fields@reqres.in",
            "first_name": "Byron",
            "last_name": "Fields",
            "avatar": "https://reqres.in/img/faces/10-image.jpg"
        },
        {
            "id": 11,
            "email": "george.edwards@reqres.in",
            "first_name": "George",
            "last_name": "Edwards",
            "avatar": "https://reqres.in/img/faces/11-image.jpg"
        },
        {
            "id": 12,
            "email": "rachel.howell@reqres.in",
            "first_name": "Rachel",
            "last_name": "Howell",
            "avatar": "https://reqres.in/img/faces/12-image.jpg"
        }
    ];
    var idArray=[];
    idArray.push({"type": "TextBlock","weight": "bolder","text": "Id"})
    var nameArray=[];
    nameArray.push({"type": "TextBlock","weight": "bolder","text": "Name"})

    var EmailArray=[];
    EmailArray.push({"type": "TextBlock","weight": "bolder","text": "Email"});


    data.forEach(function(i){
        idArray.push({"type": "TextBlock","separator":true,"text": i.id})
        nameArray.push({"type": "TextBlock","separator":true,"text": i.first_name})
        EmailArray.push({"type": "TextBlock","separator":true,"text": i.email})
    })

    var itemsArray=[
        {
            "type": "TextBlock",
            "weight": "bolder",
            "text": "Name"
        },
        {
            "type": "TextBlock",
            "separator":true,
            "text": "Apple"
        },{
            "type": "TextBlock",
            "separator":true,
            "text": "Kiwi"
        }
    ];



     var bodyArray=[
        {
            "type": "ColumnSet",
            "columns": [
                {
                    "type": "Column",
                    "items": idArray,
                    "width": 10,

                },
                {
                    "type": "Column",
                    "items": nameArray,
                    "width": 25,
                },
                {
                    "type": "Column",
                    "items": EmailArray,
                    "width": 40,
                }
                
            ]
        }
    ]

    var msg = new builder.Message(session)
    .addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": bodyArray
}
    });
session.send(msg);
    
    console.log(session);
    
    
    console.log('***************In the Greetings****************');
    //session.send("Hi  how may i help you from test bot ?");
    
    //session.send(`<table style="width:100%"><tr><th>Firstname</th><th>Lastname</th><th>Age</th></tr><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr> <td>Eve</td><td>Jackson</td><td>94</td></tr><tr> <td>John</td><td>Doe</td><td>80</td></tr></table>`);
})
.matches('Help', (session) => {
    console.log('***************In the Help****************');
    session.send('please go to help page for info http://help.quickbase.com')
})
.matches('compensation', (session) => {
    console.log('***************In the Help****************');
    session.send('please go to the form and fill the details https://bps.quickbase.com/db/bpqjjg28h?a=dbpage&pageID=148')
})
// .matches('Cancel', (session,args) => {
//      console.log(args)
//     session.send('Yay, you reached Cancel intent, you said \'%s\'.', session.message.text);
// })
.matches('Cancel', (session) => {
    console.log('In cancel');
    var query = session.message.text;
    var QNASubkey='24c702e9-1239-4c9f-a268-c2ad197589fb';
    var KBID='f64f3006-9fdf-4cf8-94a2-f75563264996';    
    cog.QnAMakerRecognizer.recognize(query, `https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/${KBID}/generateAnswer`, `${QNASubkey}`, 1, 'intentName', (error, results) => {
        session.send(results.answers[0].answer)    
    }) 
    
    session.send('Yay, you reached Cancel intent, you said \'%s\'.', session.message.text);
})
.matches('bye', (session) => {  
    session.send('I am glad I was able to help. Cheers! '+ String.fromCodePoint(0x1F642));
})
.matches('medical', (session) => {  
    session.send('Hi We are from Medical Intent '+ String.fromCodePoint(0x1F642));
})
.matches('productSearch',(session,args)=>{
    console.log('in product search');
    var intent = args.intent;
    console.log(session.message.address.user);
    var userId=session.message.address.user.id;
    var name=session.message.address.user.name;
    var clientJsonData=JSON.parse(name);
    var username=clientJsonData.username;
    var appId=clientJsonData.application;
   
    var getConfigUrl=`https://bps.quickbase.com/db/bqieij4zv?a=API_DoQuery&fmt=structured&query={9.EX.${appId}}&usertoken=bz42wy_kn5b_c2mg6n6ctcfniuibfab5cuinzq5&apptoken=bzhc34rcagv8ckb48msryc9y9cp`;
    console.log(getConfigUrl);
    fetch(getConfigUrl, {
        method: 'get',
        headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
    },
    }).then(response => response.text()).then(str => {
        //var xml=str;
        // var baseUrl=$("base_url",xml).text();
        // var userToken=$("user_token",xml).text();
        // var queryTable=$("application_id",xml).text();
        // var fetchTable=$("entity_table_name",xml).text();
        // var queryField=$("entity_name_field",xml).text();
        // var getField=$("entity_status_field",xml).text();
        // var appToken=$("app_token",xml).text();
        // var accessTo=$("access",xml).text();
        // var outputString=$("outputString",xml).text();
        
         dataAsJson = JSON.parse(convert.xml2json(str));
            var fetchClist=[7,8,9,10,11,12,13,15,16];
            console.log(fetchClist.length);
            var clistValues=getClistItemsFromResponse(dataAsJson,fetchClist);
            var baseUrl=clistValues[7];
            var userToken=clistValues[8];
            var queryTable=clistValues[9];
            var fetchTable=clistValues[10];
            var queryField=clistValues[11];
            var getField=clistValues[12];
            var appToken=clistValues[13];
            var accessTo=clistValues[15];
            var outputString=clistValues[16];
        
        
        console.log("access="+accessTo);
        var getUserRoleUrl=`${baseUrl}db/${queryTable}?a=API_GetUserRole&userid=${userId}&usertoken=${userToken}&apptoken=${appToken}`;
        console.log(getUserRoleUrl);
    fetch(getUserRoleUrl, {
            method: 'get',
            headers: { 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
        },
        })
        .then(response => response.text()).then(str => {
            console.log(str);
            dataAsJson = JSON.parse(convert.xml2json(str));            
            if(dataAsJson.elements[0].elements[1].elements[0].text=='0'){
               dataAsJson.elements[0].elements.forEach(function(element,i){
                   if(element.name=='user'){
                       // old check
                      // if(element.elements[1].elements[0].attributes.id=='16'){
                       var userRole=element.elements[1].elements[0].elements[0].elements[0].text; 
                       if(userRole==accessTo ){
                        console.log(217+"in product Search");
                        console.log(args.entities);
                        if(args.entities.length==0){
                            session.send(`didn’t understand please try again…`);
                            return false;
                        }
                        console.log("entity="+args.entities[0].entity);
                        var projectname=args.entities[0].entity;
                        var url =`${baseUrl}db/${fetchTable}?a=API_DoQuery&query={${queryField}.EX.${projectname}}&fmt=structured&usertoken=${userToken}&apptoken=${appToken}`;
                        console.log("url="+url);
                        fetch(url, {
                                method: 'get',
                                headers: { 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
                            },
                            })
                            .then(response => response.text()).then(str => {
                                dataAsJson = JSON.parse(convert.xml2json(str));
                                console.log(dataAsJson);                        
                                var tableArray=dataAsJson.elements[0].elements[5].elements;
                                console.log('tableArray');
                                console.log(tableArray)
                                tableArray.forEach(function(i,j){
                                    if(i.name=='records'){
                                        console.log(238);
                                        console.log(i.elements);
                                    if(i.elements!==undefined){
                                     i.elements.forEach(function(i,j){
                                         console.log(240);
                                        i.elements.forEach(function(i,j){
                                            if(i.elements!=undefined){
                                                  
                                             if(i.attributes!=undefined){
                                                 
                                                 
                                                 if(i.attributes.id==getField){
                                                     console.log('getField='+getField);   
                                                     let status = i.elements[0].text;
                                                     var responseOutput="";
                                                     responseOutput=outputString.replace('{item}',projectname);
                                                     responseOutput=responseOutput.replace('{result}',status);
                                                     console.log(responseOutput);
                                                     session.send(responseOutput);
                                                     //session.send(`The status of the project ${projectname} is ${status} `);    
                                                 }
                                             }
                                            
                                             }
                                        });
                                     })
                                    }else{
                                        session.send(`No data found`);  
                                    }
// 263

                                    }
                                }); 
                            })

                       }else{
                        session.send(`You are not autorised to perform this operation. please contact Admin`);
                        console.log('220');
                        return false;
                       }  
                   }

               })    

            }else{
                session.send(`Something went wrong... `);
            }
            })
    })
    
})
.onDefault((session) => {

let text=session.message.text;

if(text.includes('status') && text.includes('project')){
    
    let textArray=text.split(' ');
    let indexProject=textArray.indexOf('project')
    console.log(indexProject);
    let projectname=textArray[indexProject+1];
    console.log(projectname);
    var url =`https://bps.quickbase.com/db/bpqjjg3dy?a=API_DoQuery&query={16.EX.${projectname}}&usertoken=bz42wy_kn5b_c2mg6n6ctcfniuibfab5cuinzq5&apptoken=bzhc34rcagv8ckb48msryc9y9cp`;
   // fmt=stur 
    fetch(url, {
            method: 'get',
            headers: { 
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept',
        },
        })
        .then(response => response.text()).then(str => {
            dataAsJson = JSON.parse(convert.xml2json(str));
            console.log(dataAsJson);
            console.log(dataAsJson.elements[0].elements[6])
            if (dataAsJson.elements[0].elements[6]!=undefined){
                let status=dataAsJson.elements[0].elements[6].elements[1].elements[0].text;
                session.send(`The status of the project ${projectname} is ${status} `);
            }else{
                session.send(`Something went wrong... `);
            }
        })
}else{
    session.send(`didn't understand please try again..`); 
}

});
bot.dialog('/', intents);

function getClistItemsFromResponse(dataAsJson,items){
    console.log(items);
    console.log('ilength='+items.length);
    var returnItemValues=[];
    var tableArray=dataAsJson.elements[0].elements[5].elements;
    tableArray.forEach(function(i,j){
        if(i.name=='records'){     
            if(i.elements!==undefined){
                i.elements.forEach(function(i,j){
                   i.elements.forEach(function(i,j){
                       if(i.elements!=undefined){
                        if(i.attributes!=undefined){
                        if(items.indexOf(i.attributes.id)===-1){
                            console.log(i.attributes.id);
                            returnItemValues[i.attributes.id]=i.elements[0].text;
                        }else{
                           // console.log('No='+i.attributes.id);
                        }    
                        }
}
});
});
}
}
});
console.log(returnItemValues.length)
return returnItemValues;
}
