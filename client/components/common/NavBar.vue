<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav v-if="!$store.state.inReaderMode">
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        fritter
      </h1>
    </div>
    <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/event_announcements"
      >
        Event Announcements
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/likes"
      >
        Likes
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/bookmarks"
      >
        Bookmarks
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
      <ReaderModeButton v-if="!$store.state.inReaderMode && $store.state.username" />
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>
import ReaderModeButton from '@/components/ReaderMode/ReaderModeButton.vue'

export default {
  name: 'NavBar',
  components: {ReaderModeButton},
};
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
