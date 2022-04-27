const util = require('util');
const { LOG_LEVEL = '' } = process.env;

/**
 * Used to log a message for things like informational logging
 * @param {string} message status message that you wish to log
 * @param {JSON} data extra data associated with the message
 */
function logMessage(message, data){
    if(LOG_LEVEL != 'silent'){
        if (data){
            message += util.inspect(data);
        }
        console.log(message);
    }
}

/**
 * Used to log an error including file name, line number and error message plus associated data
 * @param {Error} error generated error during the execution of code
 * @param {JSON} data extra data associated with the error
 */
function logError(error, data = {}){
    if(LOG_LEVEL != 'silent'){
        const caller_line = error.stack.split("\n")[1];
        data.error = {
            message: error.message,
            location: caller_line.slice(caller_line.indexOf("at ")+2, caller_line.length)
        }
        console.log(util.inspect(data));
    }
}
module.exports = { logError, logMessage }
