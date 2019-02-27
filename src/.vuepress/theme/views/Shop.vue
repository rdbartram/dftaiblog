<template>
  <div class="single-page">
    <div class="page row justify-center">
      <article class="column sm-90">
        <header class="page-header">
          <back-button/>
          <div class></div>
        </header>
        <div class="page-content" ref="content">
          <Content></Content>
        </div>
      </article>
    </div>
    <section
      class="row section-newsletter section-contact justify-center"
      v-if="$page.frontmatter.ctaContact"
    >
      <div class="column sm-100 md-67 xl-50">
        <span class="meta-text meta-text--primary">{{ $t('tip_contact') }}</span>
        <h3 class="section-contact__title">{{ $t('title_contact') }}</h3>
        <router-link :to="`${$localePath}${$t('path_route_contact')}/`">
          <kt-button class="section-contact__button" type="button">
            <span class="icon">arrow</span>
          </kt-button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import KtButton from "@theme/components/UI/Button";
import ContentMixin from "@theme/mixins/Content";

export default {
  name: "Shop",

  mixins: [ContentMixin],

  components: {
    KtButton,
    BackButton: () =>
      import(/* webpackChunkName = "BackButton" */ "@theme/components/BackButton")
  },
  mounted() {
    var spread_shop_config = {
        shopName: 'dftai',
        locale: 'en_CH',
        prefix: 'https://shop.spreadshirt.ch',
        baseId: 'shop'
    };
    let ckeditor = document.createElement("script");
    ckeditor.setAttribute(
      "src",
      "https://shop.spreadshirt.ch/shopfiles/shopclient/shopclient.nocache.js"
    );
    document.head.appendChild(ckeditor);
  }
};
</script>

<style lang="stylus">
@import '~@theme/styles/config.styl';

.single-page {
  .page-content {
    margin-top: 50px;
  }
}

.section-contact {
  &__title {
    margin-top: 5px;
    font-size: $title2;
  }

  &__button.ui-button {
    position: relative;
    left: -26px;
  }
}
</style>
