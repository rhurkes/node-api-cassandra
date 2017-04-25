# node-api-cassandra

## Installation
1. Install Docker: https://www.docker.com/

## Running
1. ```git clone https://github.com/rhurkes/node-api-cassandra.git```
2. cd into repo
2. ```docker-compose build```
3. ```docker-compose up```
4. Once Cassandra is listening, run the init script: ```./scripts/init_db.sh```
5. To test retrieving a product, run the following script: ```./scripts/example_get.sh```
6. To test updating a product's price, run the following script: ```./scripts/example_put.sh```

## API Development
1. You'll want ```nvm``` installed, do not install with ```brew``` if on OSX. Follow the instructions here: https://github.com/creationix/nvm
2. If you don't have ```yarn``` installed, install it: https://yarnpkg.com/lang/en/docs/install/
2. cd into repo
3. You don't want to have to rebuild your docker images everytime you make a change to the API layer, so let's decouple the API from the database while developing. Start by building the images: ```docker-compose build``` if they haven't been built yet.
4. Next, launch the database image created by the previous step: ```docker run --name cassandra_dev --rm -p 9042:9042 nodeapicassandra_db```
4. Once Cassandra is listening, run the dev init script: ```./scripts/init_db_dev.sh```
5. Change the ```dbHost``` value in ```config.json``` to be ```localhost``` (TODO: env-based configs would be helpful here). Don't check it in like this!
6. Build and run the API server: ```nvm i && yarn install && npm run start```
