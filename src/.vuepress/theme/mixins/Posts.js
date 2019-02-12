export default {
  computed: {
    postsByLang() {
      return [...this.$posts.filter(post => {
        return post.lang === this.$localeConfig.lang
      })]
    }
  },
  methods: {
    getPostsByAuthor (nickname) {
      return this.postsByLang.filter(post => {
        return post.author === nickname
      })
    },

    getAmountPostsByAuthor (nickname) {
      const posts = this.getPostsByAuthor(nickname)
      return `${posts.length} ${this.$t('article')}${posts.length > 1 ? 's' : ''}`
    },

    getAmountPostsByAuthorAsInt (author) {
      const posts = this.getPostsByAuthor(author.frontmatter.nickname)
      return posts.length
    }
  }
}
