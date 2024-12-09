const node_canvase = require("canvas");
const fs = require("fs");
const { Image } = node_canvase;
const path = require("path");
const sharp = require("sharp");
/*
    width: 500px;
    height: 325px;*/
const canvas = node_canvase.createCanvas(500, 325);
const ctx = canvas.getContext("2d");
function reformat(imageSRC) {
    return new Promise((resolve, reject) => {
        try {
            const image = new Image();
            image.onload = () => {
                const ratio = image.width / image.height;
                let newWidth = canvas.width;
                let newHeight = newWidth / ratio;
                if (newHeight < canvas.height) {
                    newHeight = canvas.height;
                    newWidth = newHeight * ratio;
                }
                const xOffset = newWidth > canvas.width ? (canvas.width - newWidth) / 2 : 0;
                const yOffset =
                    newHeight > canvas.height ? (canvas.height - newHeight) / 2 : 0;
                ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
                resolve(canvas.toBuffer("image/jpeg"));
            }
            image.onerror = (err) => {
                if(err.message.includes('Unsupported image type')){
                    sharp(imageSRC).jpeg().toBuffer().then((data) => {
                        fs.writeFile(imageSRC.split(".")[0] + ".jpg", data, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("File converted to jpg");
                                reformat(imageSRC.split(".")[0] + ".jpg").then((data) => {
                                    resolve(data);
                                }).catch((err) => {
                                    reject(err);
                                });
                            }
                        });
                    });
                }else{
                    reject(err);
                }
            }
            image.src = imageSRC;
        } catch (err) {
            reject(err)
        }
    });

}

const dirURL = "../static/assets/images/game_covers";

fs.readdir(dirURL, async (err, files) => {
    console.log(files)
    if (err) {
        console.log(err);
    } else {
        try {
            for (var i = 0; i < files.length; i++) {
                const file = files[i];
                if(file.includes("reformated")){
                    continue;
                }
                console.log(file);
                const imageSRC = `${dirURL}/${file}`;
                const newSRC = await reformat(imageSRC);
                // remove the old file
                fs.unlinkSync(imageSRC);
                const destSRC = `${dirURL}/${file.split(".")[0]}.jpg`;
                console.log(destSRC);
                fs.writeFile(destSRC, newSRC, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("File saved");
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
});