require('dotenv').config();
const csv = require('csv-parser');
const fs = require('fs');
const { SendEmailCommand, SESClient } = require('@aws-sdk/client-ses');

const client = new SESClient({
    region: 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const recipients = [];

async function getRecipients() {
    return new Promise((resolve, reject) => {
        fs.createReadStream("C:/Users/andre/Downloads/template (1).csv")
            .pipe(csv())
            .on('data', (row) => {
                recipients.push(row.email);
            })
            .on('end', () => {
                resolve();
            });
    });
}

const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #4CAF50;
        }
        p {
            margin: 10px 0;
        }
        a {
            color: #1E90FF;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
            max-width: 600px;
            margin: auto;
        }
        code {
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 4px 8px;
            font-family: Consolas, monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello!</h1>
        <p>You are getting this email becuase you have previously created a CCPorted account.</p>
        <p>Many people have been saying that none of the links have been working for them. In order to fix this, I have created a new "underground" document. This document should be shared to students only, and it will not be visible on any public pages.</p>
        <p>Share it with all of your friends, so that everyone can have access to the games.</p>
        <p>Last but not least, remember to <a href="https://discord.com/invite/GDEFRBTT3Z">join the Discord</a></p>

        <p>Here is the link: <a href = "https://docs.google.com/document/d/1-mXdD-aplqeTUOwv41YpcxqU-VwurYxsIZPAHXSYTzY/edit?tab=t.0">CCPorted Underground Doc</a></p>
    </div>
</body>
</html>
`
const emailText = `
Hello!

You are getting this email becuase you have previously created a CCPorted account.
Many people have been saying that none of the links have been working for them. In order to fix this, I have created a new "underground" document. This document should be shared to students only, and it will not be visible on any public pages.
Share it with all of your friends, so that everyone can have access to the games.

Last but not least, remember to join the Discord: https://discord.com/invite/GDEFRBTT3Z

Here is the link: https://docs.google.com/document/d/1-mXdD-aplqeTUOwv41YpcxqU-VwurYxsIZPAHXSYTzY/edit?tab=t.0
`

async function sendEmails(recipients) {
    for (let i = 0; i < recipients.length; i++) {
        const params = {
            Destination: {
                ToAddresses: [recipients[i]]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: emailHTML
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: emailText
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'CCPorted Unblocked Links (Underground Document)'
                }
            },
            Source: 'sojscoder@gmail.com'
        };
        try {
            await client.send(new SendEmailCommand(params));
            console.log(`Email sent to ${recipients[i]}`);
        } catch (err) {
            console.error(err);
        }
    }
}

async function main() {
    await getRecipients();
    await sendEmails(recipients);
}
main().then(() => {
    console.log('Finished sending emails');
}).catch(err => {
    console.error(err);
});