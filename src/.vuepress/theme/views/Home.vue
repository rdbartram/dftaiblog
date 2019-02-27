<template>
  <div class="page home">
    <div class="row" v-if="$posts.length">
      <div class="home__first-card column md-50">
        <card-post :item="latestPosts[0]" cover="top"/>
      </div>
      <div class="column md-50">
        <div class="row" style="flex-direction: column">
          <h3>Where We're Presenting Next</h3>
          <ul class="more-posts__list">
            <li class="more-posts__item">
              <aside v-for="event in getEvents" class="row">
                <div class="column xs-50">
                  <a :href="event.url" target="_blank">{{event.name}}</a>
                </div>
                <div class="column xs-25">{{event.author}}</div>
                <div class="column xs-25">{{event.date.toLocaleDateString("en-GB", {day:"numeric", month: "long",year: "numeric"})}}</div>
              </aside>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <section
      v-if="$themeLocaleConfig.newsletter.action"
      class="row section-newsletter justify-center"
    >
      <div class="column sm-100 md-67 xl-50">
        <newsletter/>
      </div>
    </section>

    <more-posts class="home__see-more" :posts="morePosts">
      <sidebar slot="sidebar"/>
    </more-posts>
  </div>
</template>

<script>
import CardPost from "@theme/components/CardPost";
import MorePosts from "@theme/components/MorePosts";
import Sidebar from "@theme/components/Sidebar";

import PostsMixin from "@theme/mixins/Posts";

export default {
  name: "Home",

  mixins: [PostsMixin],

  components: {
    Sidebar,
    CardPost,
    MorePosts,
    Newsletter: () =>
      import(/* webpackChunkName = "Newsletter" */ "@theme/components/Newsletter")
  },

  computed: {
    latestPosts() {
      return [...this.postsByLang].slice(0, 1);
    },

    morePosts() {
      return [...this.postsByLang].splice(1, 6);
    },

    getEvents() {
      const authors = this.$authors.filter(author => {
        return author.frontmatter.lang === this.$localeConfig.lang;
      });

      var events = [];
      authors.forEach(author => {
        author.frontmatter.events
          .filter(event => {
            return Date.now() < new Date(event.date);
          })
          .forEach(event => {
            event.date = new Date(event.date);
            event.author = author.frontmatter.name;
            events.push(event);
          });
      });

      return events.sort((a, b) => a.date - b.date);
    }
  }
};
</script>

<style lang="stylus">
@import '~@theme/styles/config.styl';

.home {
  &__first-card {
    @media (max-width: $max-tablet) {
      margin-bottom: 30px;
    }
  }

  &__see-more.row {
    margin-top: 50px;
  }
}
</style>
