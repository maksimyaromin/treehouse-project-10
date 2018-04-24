# Build a Library Manager
The application contains an example of a possible implementation of a web library on Express using a local SQL repository on SQLite.

The application shows the operation with ORM Sequelize system. The logic of interaction with it is described in *src/database* folder. The interaction API methods for each schema are in *src/models* folder.

Almost every page of the site contains a list, which is built with the help of its own simple jQuery plugin. In order to build dynamical list for each model, the model contains an array with a description of the columns.

The design of the site was slightly altered by me, but it was done in general by the proposed layouts. Well, as usually  I used gulp to build the project.

To run the project the following commands might be used
```shell
    npm install
    npm start
```
or
```shell
    npm install
    node src/app.js
```

### I hope you will enjoy it. Max Eremin