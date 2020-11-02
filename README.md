# QualiChainFE

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.12.

Migrated to version 10.0.1

## How to install
    - Clone this repository (git clone https://github.com/QualiChain/fe.git)
    - Access to the main folder: cd qualichain
    - Install dependecies: npm i

## Update custom config file

You must copy and rename the file /src/assets/config.tempate.json as /src/assets/config.json. Edit the file /src/assets/config.json and introduce valid credentials to be able to use OU APIs
```
{
    "OU_API_DATA" : {
        "baseUrl": "http://localhost:4200",
        "authentication": {
            "endPoint": "qualichain/users/signin",
            "adminUser": {
                "username" : "<username>",
                "password" : "<password>"
            },
            "issuerUser": {
                "username" : "<username>",
                "password" : "<password>"
            }
        },
        "apis": {
            "createBadge": "qualichain/badges/create",
            "createNewBadgeIssuance": "qualichain/assertions/create",
            "confirmBadgeIssuance": "qualichain/assertions/issue",
            "revokeBadgeIssuance": "qualichain/assertions/revoke",
            "assertionsList": "qualichain/assertions/list",
            "getRecipients": "qualichain/recipients/list",
            "getBagdes": "qualichain/badges/list"
        }
    }
}
```

## Proxy configuration

To be able to avoid CORS problems and consum the OU APIs there is a proxy.

In case we need to change the proxy configuration, because we must use another target, we need to update the file 'src/proxy.conf.json'

## Docker

- Create the docker image:
```
docker build -t qualichain-fe-app .
```

- Run the docker container with:
```
docker run --name ng-app-qualichain-fe -d -p 80:80 qualichain-fe-app
```

- In your browser, navigate to 'http://localhost'

It deploys the FE in a nginx server

The default.conf file is used to configure nginx as proxy to solve CORS problem.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --host 0.0.0.0` for a dev server to allow you to access by IP instead of localhost.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
