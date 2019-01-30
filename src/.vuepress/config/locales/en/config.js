const ads = require("./ads");

module.exports = {
  languages: {
    label: "English",
    shortname: "EN"
  },
  translation: {
    news_title:
      "Receive our articles, podcasts and videos directly in your inbox and stay up to date."
  },
  ads,
  logo: {
    name: "dftai-logo",
    ext: "png",
    alt: "DFTAI"
  },
  share: {
    twitterVia: "rd_bartram"
  },
  newsletter: {
    provider: "mailchimp",
    action: false
    //   ""
  },
  copy: `2019 © DFTAI -
        <a href="https://vuepress.vuejs.org/" rel="noopener" target="_blank">
          MADE WITH VUEPRESS
        </a>`,
  footer: {
    nav1: {
      title: "DFTAI",
      items: [
        {
          label: "ABOUT",
          path: "/about/"
        },
        {
          label: "CATEGORIES",
          path: "/categories/"
        },
        {
          label: "CONTACT",
          path: "/contact/"
        }
      ]
    },
    nav2: {
      title: "Community",
      items: [
      ]
    }
  },
  social: [
    {
      name: "twitter",
      link: "https://www.twitter.com/rd_bartram"
    },
    {
      name: "github",
      link: "https://www.github.com/rdbartram"
    }
  ]
};
