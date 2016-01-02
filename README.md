# Albus

> Albus is a real-time collaborative whiteboard. Key features include:

- suggested snapping points to shape corners and midpoints using k-d trees;
- automatic path smoothing for freehand drawing;
- path autofill upon closing;
- infinite board panning and zooming

![alt tag](https://raw.githubusercontent.com/QuixoticScientist/whiteboard/dev/client/assets/images/albus-screenshot-1.png)
![alt tag](https://raw.githubusercontent.com/QuixoticScientist/whiteboard/dev/client/assets/images/albus-screenshot-2.png)

Data flows onto the board in the following path:

![alt tag](https://raw.githubusercontent.com/QuixoticScientist/whiteboard/master/client/assets/images/frontend-dataflow.png)

## Team

  - __Product Owner__: Haley Bash
  - __Scrum Master__: Lorenzo De Nobili
  - __Development Team Members__: Christian Everett, Lorenzo De Nobili, Rory Sametz, Haley Bash

## Table of Contents

1. [Usage](#Usage)
1. [Technologies Used](#technologies-used)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Contributing](#contributing)

## Usage

Visit the page, currently hosted on [albus.io](http://albus.io)

## Technologies Used

- [AngularJS](http://angularjs.org)
- [Node](https://nodejs.org/)
- [Express](http://expressjs.com/)
- [Redis](http://redis.io/)
- [Raphael](http://raphaeljs.com)
- [Socket.io](http://socket.io/)
- [Heroku Deployment](https://www.heroku.com/)

## Requirements

- [Node 0.10.x](https://nodejs.org/en/download/)
- [Redis](http://redis.io/download)

## Development Process

### Step 0: Fork and clone the repository from GitHub

### Step 1: Installing Dependencies

Run the following in the command line, from within the repository:

```sh
bower install
npm install
```

### Step 2: Running Locally

Run the Redis database from the command line, in one tab:
```sh
redis-server
```

Run the server in the other tab using node:

```sh
npm run server
```

### Step 3: Making Local Changes

Each time a change is made, run the following to update the minified files:

```sh
grunt release
```

### Visiting the server

While node is running, visit the locally running server at [127.0.0.1:3000](127.0.0.1:3000)
