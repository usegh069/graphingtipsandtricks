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
        <p>CCPorted has changed the login/signup system. Please login to your account using either your username or email address.</p>
        <p>Then, click "forgot password" to reset your password.</p>
        <p>Thank you for using CCPorted!</p><br><br>
        <p>If you have any questions, please respond to this email.</p>
        <p>If some of the links do not work for you on the <a href="https://docs.google.com/document/d/11yw7n2F84XOkAwpM8tF-ZYHESuus1Gg7dmJ-WJum1fk/edit?tab=t.0#heading=h.5bvxli85krky">Master Doc</a>, go ahead and <a href="https://discord.com/invite/GDEFRBTT3Z">join the Discord</a> and check the <code>#-game-links channel</code> for more links.</p>
    </div>
</body>
</html>
`
const emailText = `
Hello!

CCPorted has changed the login/signup system. Please login to your account using either your username or email address.
Then, click "forgot password" to reset your password.
Thank you for using CCPorted!

If you have any questions, please respond to this email.
If some of the links do not work for you on the Master Doc, go ahead and join the Discord and check the #-game-links channel for more links.

(Master Doc: https://docs.google.com/document/d/11yw7n2F84XOkAwpM8tF-ZYHESuus1Gg7dmJ-WJum1fk/edit?tab=t.0#heading=h.5bvxli85krky)
(Discord: https://discord.com/invite/GDEFRBTT3Z)
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
                    Data: 'CCPorted Login System Update'
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