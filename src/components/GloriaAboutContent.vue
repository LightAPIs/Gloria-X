<template>
  <div class="gloria-about-content">
    <div class="about-header">
      <img src="@/assets/icons/app/icon-128.png" />
      <div class="header-text">Gloria-X {{ ' v' + version }}</div>
    </div>
    <el-divider content-position="left">
      {{ i18n('aboutSupport') }}
    </el-divider>
    <div>
      <p>
        {{ i18n('aboutSupportLabel') }}
      </p>
      <ul>
        <li v-for="(item, index) in support" :key="index">
          <a target="_blank" :href="item.url">
            {{ item.title }}
          </a>
        </li>
      </ul>
    </div>
    <el-divider content-position="left"> {{ i18n('aboutThanks') }} ❤️ </el-divider>
    <div>
      <p>
        {{ i18n('aboutThanksLabel') }}
      </p>
      <ul>
        <li v-for="(item, index) in thanks" :key="index">
          <a target="_blank" :href="item.url">
            {{ item.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'gloria-about-content',
  data() {
    return {
      version: process.env.VUE_APP_VERSION,
      support: [
        {
          url: 'https://github.com/LightAPIs/Gloria-X',
          title: this.i18n('aboutSourceCode'),
        },
        {
          url: 'https://github.com/LightAPIs/Gloria-X/issues',
          title: this.i18n('aboutIssues'),
        },
        {
          url: 'https://docs.gloria.pub/',
          title: `${this.i18n('aboutGuide')} (https://docs.gloria.pub/)`,
        },
        {
          url: 'https://gloria.pub/',
          title: `${this.i18n('aboutShare')} (https://gloria.pub/)`,
        },
      ],
      thanks: [
        {
          url: 'https://github.com/BlackGlory/Gloria',
          title: 'BlackGlory/Gloria (MIT License)',
        },
        {
          url: 'https://github.com/a62527776a/vue-floating-action-button',
          title: 'a62527776a/vue-floating-action-button (MIT License)',
        },
        {
          url: 'https://github.com/akanshgulati/scrap-favicon',
          title: 'akanshgulati/scrap-favicon (MIT License)',
        },
        {
          url: 'https://github.com/ElemeFE/element',
          title: 'ElemeFE/element (MIT License)',
        },
        {
          url: 'https://github.com/GitHub-Laziji/menujs',
          title: 'GitHub-Laziji/menujs (MIT License)',
        },
        {
          url: 'https://github.com/Simonwep/selection',
          title: 'Simonwep/selection (MIT License)',
        },
        {
          url: 'https://github.com/vuejs/vue',
          title: 'vuejs/vue (MIT License)',
        },
        {
          url: 'https://github.com/yeyuqiudeng/vue-lazy-render',
          title: 'yeyuqiudeng/vue-lazy-render (MIT License)',
        },
        {
          url: 'https://github.com/yyf1994gggg/vuex-chrome',
          title: 'yyf1994gggg/vuex-chrome (MIT License)',
        },
      ],
    };
  },
});
</script>

<style lang="scss">
.gloria-about-content {
  a,
  p {
    font-size: 16px;
  }
  a {
    text-decoration: none;
  }
  li {
    margin: 5px 0px;
  }
  .about-header {
    font-size: 32px;
    text-align: center;
  }
}
</style>
