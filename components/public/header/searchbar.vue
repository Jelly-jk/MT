<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col :span="3" class="left">
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png"
          alt=""
        />
      </el-col>
      <el-col :span="15" class="center">
        <div class="wrapper">
          <el-input
            placeholder="搜索商家或地点"
            v-model="search"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <button class="el-button el-button--primary">
            <i class="el-icon-search" />
          </button>
          <dl v-if="isHotPlace" class="hotPlace">
            <!--这里是热门搜索，是有标题的加dt，并且是在没聚焦并且没输入东西时时候显示。-->
            <dt>热门搜索</dt>
            <dd
              v-for="(item, idx) in $store.state.home.hotPlace.slice(0, 4)"
              :key="idx"
            >
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{
                item.name
              }}</a>
            </dd>
          </dl>
          <dl class="searchList" v-if="isSearchList">
            <!--这里是相关搜索，自动联想的那个框，没有标题，不加dt，并且是在聚焦后且输入东西时时候显示-->
            <dd v-for="(item, idx) in searchList" :key="idx">
              <a :href="'/products?keyword=' + encodeURIComponent(item.name)">{{
                item.name
              }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <!--这里是推荐-->
          <a
            :href="'/products?keyword=' + encodeURIComponent(item.name)"
            v-for="(item, idx) in $store.state.home.hotPlace.slice(0, 4)"
            :key="idx"
            >{{ item.name }}</a
          >
        </p>
        <ul class="nav">
          <li>
            <nuxt-link to="/" class="tackout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="apartment">民宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/" class="business">商家入驻</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="right">
        <ul class="security">
          <li>
            <i class="refund" />
            <p class="txt">随时退</p>
          </li>
          <li>
            <i class="single" />
            <p class="txt">不满意免单</p>
          </li>
          <li>
            <i class="overdue" />
            <p class="txt">过期退</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      isFocus: false,
      search: "",
      hotPlace: [],
      searchList: []
    };
  },
  methods: {
    focus() {
      this.isFocus = true;
    },
    blur() {
      setTimeout(() => {
        this.isFocus = false;
      }, 200);
    },
    input: _.debounce(async function() {
      let city = this.$store.state.geo.position.city.replace("市", "");
      this.searchList = [];
      if (this.search) {
        // 这里是我自己加的，不加的话有个bug，就是默认为空也会请求内容，页面会请求回来奇怪的东西
        let {
          status,
          data: { top }
        } = await this.$axios.get("/search/top", {
          params: {
            input: this.search,
            city
          }
        });
        this.searchList = top.slice(0, 10);
      }
    }, 200)
  },
  computed: {
    isHotPlace: function() {
      return this.isFocus && !this.search; // 这里的! 是和后面的this.search连用的,表示他的去反
    }, // 这个表示失去焦点且没有输入文字的状态。
    isSearchList: function() {
      return this.isFocus && this.search;
    }
  }
};
</script>

<style lang=""></style>
