// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler,CardFactory } = require('botbuilder');
//console.dir(ActivityHandler);
const  builder  = require('botbuilder');
//const { botbuilder } = require('botbuilder').BotFrameworkAdapter;
const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');
const QB_helper=require('./../QB_helper');
//console.log(QB_helper);

class DispatchBot extends ActivityHandler {
    constructor() {
        super();
        //console.log(process.env);
        // If the includeApiResults parameter is set to true, as shown below, the full response
        // from the LUIS api will be made available in the properties  of the RecognizerResult
        const dispatchRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: `https://${ process.env.LuisAPIHostName }`
        }, {
            includeAllIntents: true,
            includeInstanceData: true
        }, true);

        const qnaMaker = new QnAMaker({
            knowledgeBaseId: process.env.QnAKnowledgebaseId,
            endpointKey: process.env.QnAEndpointKey,
            host: process.env.QnAEndpointHostName
        });

        this.dispatchRecognizer = dispatchRecognizer;
        this.qnaMaker = qnaMaker;

        this.onMessage(async (context, next) => {
          
            if('value' in context.activity){
            if("userText" in context.activity.value ){
                if(context.activity.value.userText!=''){
                    await context.sendActivity(`You send ${context.activity.value.userText}`);
                    next();
                }
            }
            }
            

            // First, we use the dispatch model to determine which cognitive service (LUIS or QnA) to use.
            const recognizerResult = await dispatchRecognizer.recognize(context);

            // Top intent tell us which cognitive service to use.
            const intent = LuisRecognizer.topIntent(recognizerResult);

            // Next, we call the dispatcher with the top intent.
            await this.dispatchToTopIntentAsync(context, intent, recognizerResult);

            await next();
        });
        this.onMembersAdded(async (context, next) => {
            const welcomeText = 'Type a greeting or a question about the weather to get started.';
            const membersAdded = context.activity.membersAdded;
            
            console.log('type='+context.activity.type);

            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    //await context.sendActivity('Welcome to ELP Bot '+String.fromCodePoint(0x1F642));
                    
                    //await context.sendActivity(`Welcome to Dispatch bot ${ member.name }. ${ welcomeText }`);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async dispatchToTopIntentAsync(context, intent, recognizerResult) {
        console.log('intent='+intent);
        switch (intent) {
        case 'l_HomeAutomation':
            await this.processHomeAutomation(context, recognizerResult.luisResult);
            break;
        case 'l_Weather':
            await this.processWeather(context, recognizerResult.luisResult);
            break;
        case 'None':
            await this.processSampleQnA(context);
            break;
        case 'Greeting':
        await this.processGreetings(context);
        break;

        default:
            console.log(`Dispatch unrecognized intent: ${ intent }.`);
            await context.sendActivity(`Dispatch unrecognized intent: ${ intent }.`);
            break;
        }
    }

    async processHomeAutomation(context, luisResult) {
        console.log('processHomeAutomation');

        // Retrieve LUIS result for Process Automation.
        const result = luisResult.connectedServiceResult;
        const intent = result.topScoringIntent.intent;

        await context.sendActivity(`HomeAutomation top intent ${ intent }.`);
        await context.sendActivity(`HomeAutomation intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);

        if (luisResult.entities.length > 0) {
            await context.sendActivity(`HomeAutomation entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
        }
    }

    async processWeather(context, luisResult) {
        console.log('processWeather');

        // Retrieve LUIS results for Weather.
        const result = luisResult.connectedServiceResult;
        const topIntent = result.topScoringIntent.intent;

        await context.sendActivity(`ProcessWeather top intent ${ topIntent }.`);
        await context.sendActivity(`ProcessWeather intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);

        if (luisResult.entities.length > 0) {
            await context.sendActivity(`ProcessWeather entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
        }
    }


    async processGreetings(context, luisResult) {
      

            let username;

            var clientInput=context._activity.from.name;
            console.log(clientInput);
            if(clientInput!='User'){
            var clienDataJson=JSON.parse(clientInput);
            username=clienDataJson.username;
            }else{
            username=clientInput;
            }
            console.log(username);
            await context.sendActivity(`Hi ${username},how may i help you `);
           


       
    }
    async sendCards(session){
        var data= [
            {
                "id": 7,
                "email": "michael.lawson@reqres.in",
                "first_name": "Michael",
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
        idArray.push({"type": "TextBlock","weight": "bolder","text": "Sr"})
        var nameArray=[];
        nameArray.push({"type": "TextBlock","weight": "bolder","text": "Name"})
    
        var EmailArray=[];
        EmailArray.push({"type": "TextBlock","weight": "bolder","text": "Email"});
    
        // "type": "TextBlock",
        // "text": "Sorry some of them are repeats",
        // "size": "medium",
        // "weight": "lighter"
    
        data.forEach(function(i){
            var id =i.id.toString();
            console.log(typeof(id));
            idArray.push({"type": "TextBlock","separator":true,"text": id})
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
    
        console.log(idArray);
        //console.dir(ActivityHandler);
        var cardJson={
         "contentType": "application/vnd.microsoft.card.adaptive",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "type": "AdaptiveCard",
        "version": "1.0",
        "body": bodyArray
    
        };
        // var msg = new ActivityHandler.Message(session)
        // .addAttachment();
    // session.sendActivity(msg);
    //const randomlySelectedCard = CARDS[Math.floor((Math.random() * CARDS.length - 1) + 1)];
    await session.sendActivity({
        text: 'Reports for QB',
        attachments: [CardFactory.adaptiveCard(cardJson)]
    });
    
    var inputCard={
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Test Adaptive Card"
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Text:"
                            }
                        ],
                        "width": 20
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "Input.Text",
                                "id": "userText",
                                "placeholder": "Enter Some Text"
                            }
                        ],
                        "width": 80
                    }
                ]
            }
        ],
        "actions": [
            {
                "type": "Action.Submit",
                "title": "Submit"
            }
        ],
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.0"
    };
    
    await session.sendActivity({
        text: 'Input the details',
        attachments: [CardFactory.adaptiveCard(inputCard)]
    });
    console.log('here input')
    
    // builder.Prompts.choice(sess, "Pick a dialog.", [
    //     "Audio Card"
    //     ,"Video Card"
    //     ,"Animation Card"
    //     ,"Thumbnail Card"
    //     ,"Hero Card"
    //     ,"Sign-In Card"
    //     ,"Exit"
    // ]);
    //builder.Prompts.text(sess, "Hello user! What may we call you?");
    
    //builder.Prompts.choice(session, "Was this helpful?","Yes|No",{listStyle:3});
    
    console.log(session.pro)
    
    
    
    
    
    //console.log(session);
    
            //session.sendActivity('Greeting m aaya');
    }

    async processSampleQnA(context) {
        console.log('processSampleQnA');
        //console.log(context);
        const results = await this.qnaMaker.getAnswers(context);
        console.log(results);
        if (results.length > 0) {
            await context.sendActivity(`${ results[0].answer }`);
        } else {
            //await context.sendActivity('Sorry, could not find an answer in the Q and A system.');
        }
    }
    async sendValueToDialogAsync(turnContext)
{
    console.log('here 317');
    console.log(turnContext);
    // Serialize value
    var json = JSON.stringify(turnContext.activity.value);
    // Assign the serialized value to the turn context's activity
    turnContext.activity.text = json;
    // Create a dialog context
    var dc = await this.dialogs.createContext(turnContext);
    // Continue the dialog with the modified activity
    await dc.continueDialog();
}
}

module.exports.DispatchBot = DispatchBot;