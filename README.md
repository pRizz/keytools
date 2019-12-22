# KeyTools - A Nano web toolbox

## Developer instructions

### Prepare for build (Ubuntu example)`

`apt-get install`\
`git clone https://github.com/Joohansson/keytools`\
`cd keytools`\
`npm install`

### Test application

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build application

`npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

### Get started adding a new tool

1. Copy any tool.js file and rename it to MyTool.js
2. Alter the row at the top: <class MyTool extends Component {>
3. Alter the row at the bottom: <export default MyTool>
4. Change tools/index.js: Add <import MyTool from './MyTool.js'>
5. Change tools/index.js: Add the new class to <export {ConvertTool,...>
6. Change mainPage.js: Add the new class to <import { ConvertTool,...>
7. Change mainPage.js: Add the new class to <const tools = [ConvertTool,...>
8. Change mainPage.js: Add a tool dropdown title to <this.tools = ['1: Unit Converter',...>
9. The new tool should now be available from the main dropdown selector. Happy coding!

## Notable Sources

Nano-currency-js: https://github.com/marvinroger/nanocurrency-js
Nano-currency-web-js: https://github.com/numsu/nanocurrency-web-js
Nano webGL: https://github.com/numtel/nano-webgl-pow
jsQR: https://github.com/cozmo/jsQR
Nanoo.tools (Inspiration, zero code copy): https://nanoo.tools/

## Contribution

Find this useful? Send me a Nano donation at `nano_1gur37mt5cawjg5844bmpg8upo4hbgnbbuwcerdobqoeny4ewoqshowfakfo`
