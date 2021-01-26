let TIME_PULLED_KEY = "TIME_PULLED";
let STOCKS_DATA_OBJECT = [];

const saveTime = (time) => {
    localStorage.setItem(TIME_PULLED_KEY, time);
}

const getTime = () => {
    let time = localStorage.getItem(TIME_PULLED_KEY);
    return time ? time : "";
}

const deleteTime = () => {
    localStorage.removeItem(TIME_PULLED_KEY);
}

module.exports = {
    STOCKS_DATA_OBJECT: STOCKS_DATA_OBJECT,
    saveTime: saveTime,
    getTime: getTime,
    deleteTime: deleteTime, 
};
  