import $ from "jquery"

let objClone = function (obj) {
    let res = {};

    return JSON.parse(JSON.stringify(obj));;
};

export {objClone}