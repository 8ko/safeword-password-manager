const axios = require('axios')
const qs = require('qs')

const option = {
    headers: { 'Content-type': 'application/x-www-form-urlencoded' }
}

const message = code => {
    switch (+code) {
        case 0:
            return 'Message sent'
        case 1:
            return 'Invalid number'
        case 2:
            return 'Number not supported'
        case 3:
            return 'Invalid API CODE'
        case 4:
            return 'Maximum Message per day reached. This will be reset every 12MN'
        case 5:
            return 'Maximum allowed characters for message reached'
        case 6:
            return 'System OFFLINE'
        case 7:
            return 'Expired ApiCode'
        case 8:
            return 'iTexMo Error. Please try again later'
        case 9:
            return 'Invalid function parameter'
        case 10:
            return `Recipient's number is blocked due to FLOODING, message was ignored`
        case 11:
            return `Recipient's number is blocked temporarily due to HARD sending (after 3 retries of sending and message still failed to send) and the message was ignored. Try again after an hour`
        case 12:
            return `Invalid request. You can't set message priorities on non corporate apicodes`
        case 13:
            return `Invalid or Not Registered Custom Sender ID`
        case 14:
            return `Invalid preferred server number`
        case 15:
            return `IP Filtering enabled - Invalid IP`
        case 16:
            return `Authentication error`
        case 17:
            return `Telco Error`
        case 18:
            return `Message Filtering Enabled`
        case 19:
            return `Account suspended`
        default:
            return 'Nothing'
    }
}

function itexmo({
    apiCode,
    apiPwd,
    priority = 'NORMAL',
    senderID = null,
    server = null
}) {
    const send = async ({ to, body }) => {
        const payload = {
            1: to,
            2: body,
            3: apiCode,
            passwd: apiPwd,
            5: priority,
            6: senderID,
            7: server
        }

        return await axios
            .post(
                'https://www.itexmo.com/php_api/api.php',
                qs.stringify(payload),
                option
            )
            .then(data => message(data.data))
            .catch(res => res.toJSON().message)
    }

    return { send }
}

module.exports = itexmo