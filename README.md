# Etherscan api

## Getting started

### Complex

 - Clone the repository
 - Copy and rename ".env.example" file to ".env"
 - Fill in database credentials and etherscan api key. Keep in mind that you haven't to bootstrap database by yourself
    ```js
    DB_HOST=    // Dataabse host
    DB_PORT=    // Database port
    DB_USER=    // Database user's username
    DB_PWD=     // Database user's password
    DB_DB=      // Database name
    DB_SCHEMA=  // Database schema name

    ETHERSCAN_APIKEY=   // Etherscan api key
    ```
 - Start application with 
   ```sh
   docker compose up -d
   ```
### Standalone
 - Clone the repository
 - Copy and rename ".env.example" file to ".env"
 - Fill in database credentials and etherscan api key. Keep in mind that you haven't to bootstrap database by yourself
    ```js
    DB_HOST=    // Dataabse host
    DB_PORT=    // Database port
    DB_USER=    // Database user's username
    DB_PWD=     // Database user's password
    DB_DB=      // Database name
    DB_SCHEMA=  // Database schema name

    ETHERSCAN_APIKEY=   // Etherscan api key
    ```
 - Start application with 
   ```sh
   npm run build
   npm run start:prod
   ```

## Api requests
[GET] /tx - get most changed address
```sh
   http://localhost:3000/tx?period=100 #period is optional
```
Response:
```js
   {
     from: number;
     to: number;
     mostChangedAddress: string;
     value: string;
   }
```
