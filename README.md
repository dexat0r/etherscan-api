# Etherscan api

## Getting started

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

## Api requests
