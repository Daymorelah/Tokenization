# Tokenization
CSN111131 coursework

### TECHNOLOGIES
#### Backend:
The Backend was implemented using:
 * [Yarn](https://yarnpkg.com/) Yarn is a package manager that doubles down as project manager.
 * [Node](https://nodejs.org/en/) Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine
 * [Express](https://expressjs.com/) Express is a minimal and flexible Node.js web application framework
 
 ## INSTALLATION
 * install [Node js](https://nodejs.org/en/)
 * Clone the repository `git clone https://github.com/Daymorelah/Tokenization.git` 
 * Navigate to the project in your terminal
 * Run `yarn install` to install dependencies
 * Run `yarn dev-start` to get the app started on your local machine.
 
#### Testing the API endpoints
 * Ensure you create an `.env` file which will contain your JWT secrete. You must have this in your project for the code to work.
 you can check the `.env.sample` file to se how the `.env` file should look like.
 * Check the folder path: `/project_directory>/src/route/index.js` for avaialble endpoints
 * Open Postman and type `localhost:2003/api/v1/<endpoit_to_consume>` in the URL
 * Feed in your payload for each request using JSON format e.g
 For generating a token use the payload below:
 ```
 {
    "payload": {
        "role": "user",
        "permission": "partial",
        "access": "low"
    }
}
```
For verifing a token use th epayloa dbelow:
```
{
    "payload": "your token goes here"
}
```
 For AES and Chacha20 encryption use the payload below:
 ```
 {
    "data": {
        "role": "user",
        "permission": "partial",
        "access": "low"
    },
    "password": "vanilla",
}
```
 For AES and Chacha20 decryption use the payload below:
 ```
 { 
    encryptedToken: 'encrypted token goes here...'
 }
 ```
For RSA and Elliptic curve encryption, use the payload below:
```
{
    "data": {
        "role": "user",
        "permission": "partial",
        "access": "low"
    },
    "password": "vanilla",
    "name": "qudus",
    "email": "olawalequdus@wemail.com"
}
```
For RSA and Elliptic curve decryption, use the payload below:
```
 { 
    encryptedToken: 'encrypted token goes here...'
 }
 ```
 
## Contributing
* Fork this repository
* Clone to your local environment: https://github.com/Daymorelah/Tokenization.git
* Create your feature branch: git checkout -b ft-my-new-feature
* Commit your changes: git commit -am 'Add some feature'
* Write test for the new features
* Push to the branch **development** by doing:  `git push origin -u ft-my-new-feature`
* Submit a pull request against the development branch

### Author
* Ademola Hussain
