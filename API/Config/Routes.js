module.exports = {
    "/transaction/testapi/:name": {
        controller: "testapi",
        allowedMethod: ['POST', 'GET']
    },
    "/transaction/testapi": {
        controller: "testapi",
        allowedMethod: ['POST', 'GET']
    },
    "tokens/client": {
        controller: "testapi",
        allowedMethod: ['POST', 'GET']
    }

}