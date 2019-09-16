## Client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Clone and install the dependencies

To clone this project, execute: 

1. `https://gitlab.dpi.inpe.br/terrabrasilis/terrabrasilis.git`
2. `git fetch --all`
3. `git pull --all`
4. `git checkout <branch> (e.g: devel_FM_001)`
5. `cd webapp`
6. `npm i`

After all statements above was executed, the project will be prepare to run the steps bellow.

## Development server

Run `npm run start-webpack-dev` for a dev server. Navigate to `http://localhost:8080/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run start-build-prod` to build the project to production. The build artifacts will be stored in the `dist/` directory. 

## Using dependency from link

Use the local packages from source code that you are develop via npm link.

- Go to the root path of the library source code and run "npm link"
- After that, into your current project, use "npm link <the_name_of_library>"

## Running unit tests

## Running end-to-end tests (e2e)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
