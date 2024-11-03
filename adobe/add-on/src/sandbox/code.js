import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

function start() {
    const sandboxApi = {
        createWeatherTextElements: (city, temperature, desc) => {
            // title
            const titleText = editor.createText();
            titleText.fullContent.text = city;
            titleText.translation = { x: 800, y: 200 };
            titleText.textAlignment = 3;

            // temp + desc
            const temperatureText = editor.createText();
            temperatureText.fullContent.text = temperature + ", " + desc;
            temperatureText.translation = { x: 800, y: 2250 };
            temperatureText.textAlignment = 3

            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(titleText);
            insertionParent.children.append(temperatureText);
        },

        createBorder: () => {
            const rect = editor.createRectangle();
            rect.fill = editor.makeColorFill({red: 0.24, green: 0.26, blue: 0.28, alpha: 1})
            rect.height = 2400;
            rect.width = 1600;

            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rect);
        }
    };

    runtime.exposeApi(sandboxApi);
}

start();
