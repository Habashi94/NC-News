// const server = require("./server");

// const { PORT = 9090 } = process.env;

// server.listen(PORT, () => console.log(`Listening on ${PORT}...`));

const server = require("./server");
const express = require("express");
const { PORT = 9090 } = process.env;
server.listen(PORT, () => console.log(`Listening on ${PORT}...`));
