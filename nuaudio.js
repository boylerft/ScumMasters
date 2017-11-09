var artists = {
    "tyler the creator" : {
        "album" : "released flower boy",
        "when" : "July 21, 2017"
    },
    "rihanna" : {
        "album" : "released Anti",
        "when" : "January 28,2016"
    },
    "taylor swift" :{
        "album" : "released 1989",
        "when" : "October 27th 2014"
    },
    "Kanye west" : {
        "album" : "released the life of pablo",
        "when" : "February 14 2016"
    },
    "slip not" : {
        "album" : "released the Gray Chapter",
        "when" : "October 17 2014"
    },
    "mac demarco" : {
        "album" : "released This Old Dog",
        "when" : "May 5 2017"
    }
    
};

var date_release = {
    "today" : {
        "artist" : "Tyler The Creator",
        "when" : "  November 2nd"
    },
    "next week" : {
        "artist" : "Rihanna",
        "when" : "November 7th"
    },
     "next month" : {
        "artist" : "Mac DeMarco",
        "when" : "December 4th"
     }
};


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

    // if (event.session.application.applicationId !== "") {
    //     context.fail("Invalid Application ID");
    //  }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;
    var more_intent_value = 0;

    // dispatch custom intents to handlers here
    if (intentName == "ArtistsIntent"){
        handleArtistResponse(intent, session, callback);
        more_intent_value = 1;
        
    }else if (intentName == "DateIntent" ){
        handleDateResponse(intent, session, callback);
        more_intent_value = 2;
    }else if (intentName == "MoreIntent" ){
        handleMoreResponse(intent, session, callback);
    
    }else if (intentName == "AMAZON.YesIntent" ){
        handleYesResponse(intent, session, callback);
        
    } else if (intentName == "AMAZON.NoIntent"){
        handleNoResponse(intent, session, callback);
        
    } else if (intentName == "AMAZON.HelpIntent"){
        handleGetHelpRequest(intent, session, callback);
        
    } else if (intentName == "AMAZON.StopIntent"){
        handleFinishSessionRequest(intent, session, callback);
        
    } else if (intentName == "AMAZON.CancelIntent"){
        handleFinishSessionRequest(intent, session, callback);
        
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    
    var speechOutput = "Welcome to NuAudio! I can tell you about some new album releases: " +
        "Which artist do you want to know about?"
    
    var reprompt = "Which artist do you want to know about?"
    
    var header = "NuAudio releases"
    
    var shouldEndSession = false
    
    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }
    
    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))
}

function handleArtistResponse(intent, session, callback) {
    var artist = intent.slots.Artists.value.toLowerCase()
    
    if (!artists[artist]){
        var speechOutput = "That artist is not in my current database. Try another"
        var repromtText = "Try asking about another artist"
        var header = "Not on here"
        
    } else {
        var album = artists[artist].album
        var when = artists[artist].when
        var speechOutput = capitalizeFirst(artist) + " " + album + " " + when + ". Do you wnat to know about another?"
        var repromptText = "Do you want to know about another artist?"
        var header = capitalizeFirst(artist)
        
    }
    var shouldEndSession = false
    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleMoreResponse(intent, session, callback) {
    if (more_intent_value = 1){
        handleArtistResponse(intent, session, callback)
    }
    else if (more_intent_value = 2){
        handleDateResponse(intent, session, callback)
    }
}

function handleDateResponse(intent, session, callback) {
    var date = intent.slots.Date.value.toLowerCase()
    
    if (!date_release[date]){
        var speechOutput = "Sorry, that date is to far in the future. Try another"
        var repromtText = "Try asking about new music today"
        var header = "Not on here"
        
    } else {
        var artist = date_release[date].artist
        var when = date_release[date].when
        var speechOutput = capitalizeFirst(artist) + " " + "has new music on" + " " + when + ". Do you want to know about another?"
        var repromptText = "Do you want to know about another artist?"
        var header = capitalizeFirst(artist)
        
    }
    var shouldEndSession = false
    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleYesResponse(intent, session, callback) {
    var speechOutput = "Dope! What would you like to hear about now?"
    var repromptText = speechOutput
    var shouldEndSession = false
    
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function  handleNoResponse(intent, session, callback){
    handleFinishSessionRequest(intent, session, callback)
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {artists};
    } 
    var speechOutput = "I can tell you about artists" + " or I can tell you about new music releases by date. What would you like to hear?"
    
    var repromptText = speechOutput
    
    var shouldEndSession = false
    
    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye! Thanks for using NuAudio", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s){
    return s.charAt(0).toUpperCase() + s.slice(1)
}