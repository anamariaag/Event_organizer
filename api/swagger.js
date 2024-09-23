const port = process.env.PORT || 3001;

module.exports = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            title: "EVENT CONTROLLER API",
            description: "API to handle events at ITESO",
            version: "0.0.1",
            servers: ['http://localhost' + port]
        }
    },
    apis: ['src/routes/**/*.js'] //everything inside routes and subfolders, and are .js files 
}
