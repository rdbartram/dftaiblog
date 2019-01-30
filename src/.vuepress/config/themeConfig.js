const en = require("./locales/en/config");

module.exports = {
  locales: {
    "/": en
  },
  serviceWorker: {
    updatePopup: {
      message: "New content 🎉🎉",
      buttonText: "Update"
    }
  },
  disqus: "dftai",
  url: "https://dftai.ch",
  cdn: "",
  blackWhite: true,
  topNavigation: false,
  searchMaxSuggestions: 7,
  responsive: {
    active: true,
    ext: "png",
    breakpoints: [320, 427, 524, 680]
  },
  lazyLoad: {},
  share: {
    facebook: {
      appId: "300268227446469",
      version: "v3.1"
    }
  },
  elevator: {
    duration: 4000,
    mainAudio: "/music/elevator.mp3",
    endAudio: "/music/ding.mp3"
  }
};
