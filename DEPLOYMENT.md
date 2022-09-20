# On how to deploy
## App deployment

- With a Git client, or by using the command line, we must save the project in repository such as Github.
- Then, we access through an SSH terminal to our server, like so
```
ssh username@123.123.123.123
```
- After the conexion is stablished the system will ask if a firgerprint is going by be saved. We type 'yes' and press enter.
- Afterwards, we write the appropriate password and the linux terminal will be shown.
- Then, we must create a folder like so
```
mkdir foldersname
```
- and access it by typing
```
cd foldersname
```
- Now, we test if Git is installed in our server, although it usually is.
```
git
```
- After making sure that Git is there, we clone our repository with
```
git clone https://linktorepository
```
- Once the cloning is finished, we access the project's folder by
```
cd projectsname
```
- If Docker and Docker-Compose are installed, then we excecute
```
docker-compose up -d --build
```
- If not, see "DOCKER.md"
- Once the process finishes, the Docker daemon will deploy and excecute the containers 
- If we don't want to use Docker, then we simply install all the project dependencies using the command line and we excecute our application there. Please, use Docker.
