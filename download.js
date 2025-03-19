fetch("https://flashmuseum.s3.amazonaws.com/ce7d609e-6af3-85f4-1a70-66c9d3f92f26.swf", {
    "headers": {
        "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "Referer": "https://flashmuseum.org/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
}).then(response => response.arrayBuffer()).then(arrBuff => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.resolve(__dirname, 'flash.swf');
    fs.writeFileSync(filePath, Buffer.from(arrBuff));
});