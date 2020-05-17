# myChat
The myChat application is used to communicate with other people

## Features
- Rooms system
- Ability change color your username
- Login and registration system
- Ability to mute/ban user (for admin) 
- Commands system
- Emoji support
- List of active user in room

## Technologies
- Spring Boot 2.1.9
- Angular 8.2.0
- H2

## Usage
To run the application you will need <a href="https://git-scm.com/">Git</a>, <a href="https://nodejs.org/en/download/">Node.js</a> and <a href="https://www.oracle.com/java/technologies/javase-downloads.html">Java</a> installed on your computer.
Firstly clone this repo and go to the project directory.
```shell
$ git clone https://github.com/mbalcer/myChat.git
$ cd Fuel-scanner
```

### Backend
Run the application using maven plugin in your IDE using the command:
```shell
$ mvn spring-boot:run
```

### Frontend
You must install dependencies, build and run the application. You will then be able to access it at localhost:4200.

```shell
# Install dependencies
$ npm install

# Build application
$ ng build

# Start application
$ ng serve
```

## Demo
The application is available here: https://mychat-dev.herokuapp.com/

## Status
The project is in progress.

---

Created by <a href="https://github.com/mbalcer"> @mbalcer </a>
