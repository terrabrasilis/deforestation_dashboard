# About Jsonix and ogc-schemas projects

See a general explanation here:
https://pt.slideshare.net/orless/jsonix-talking-to-ogc-web-services-in-json

And one use example here:
https://jsfiddle.net/lexi/q18ej0td/

## Official repositories

https://github.com/highsource/jsonix
https://github.com/highsource/ogc-schemas


## Install

To install and include these modules into Angular project we need that steps:

- Install packages using npm
    - npm install w3c-schemas --save
    - npm install ogc-schemas --save
    - npm install jsonix --save
- Edit the types file called typings.d.ts and declare that modules
- Finally, import them into app.modules.ts