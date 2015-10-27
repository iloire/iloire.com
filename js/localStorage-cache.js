define('localStorage-cache', function () {

  return {

    get: function (key) {
      if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem(key)) { //get from HTML5 localStorage
          if (JSON.parse(localStorage.getItem(key)).expires < +new Date()) {
            localStorage.removeItem(key);
          }
          else {
            return JSON.parse(localStorage.getItem(key)).data;
          }
        }
      }
      return null;
    },

    set: function (key, obj, expiration_seconds) {
      if (typeof(Storage) !== "undefined") {
        try {
          localStorage.setItem(key, JSON.stringify({data: obj, expires: +new Date() + expiration_seconds * 1000}));
        } catch (e) {
          console.error(e);
        }
      }
    }

  };

});