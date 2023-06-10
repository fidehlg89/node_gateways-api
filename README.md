# Gateways REST API - Node.js express

This is a Node.js REST API project that allows you to manage gateways and their devices.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 0.0.1): [Download Node.js](https://nodejs.org/en/download/)
- Yarn (version 0.0.1): [Install Yarn](https://classic.yarnpkg.com/en/docs/install/)

## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/fidehlg89/gateways-api.git
   or
   git clone git@github.com:fidehlg89/gateways-api.git


2. Install the dependencies using Yarn:

   ```shell
   cd <project_directory>
   yarn install


3. Set up the environment variables:

    Create a .env file in the root directory of the project and provide the following environment variables:

    ```shell
    PORT=<port_number>
    TEST_PORT=<test_port_number>
    MONGODB_URI=<mongodb_connection_string>
    MONGODB_URI_TEST=<mongodb_test_connection_string>

4. Start the development server:

   ```shell
   yarn start

## Usage
Once the server is running, you can access the API endpoints using the following base URL:

http://localhost:<port_number>

The available endpoints are:

    POST /gateways - Create a new gateway
    GET /gateways - Get all gateways
    GET /gateways/:id - Get a gateway by ID
    PUT /gateways/:id - Update a gateway by ID
    DELETE /gateways/:id - Delete a gateway by

## Testing
To run the tests, use the following command:

   ```shell
   yarn test