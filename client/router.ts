import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';
import BookmarksPage from './components/Bookmark/BookmarksPage.vue';
import EventAnnouncementsPage from './components/EventAnnouncements/EventAnnouncementsPage.vue';
import LikesPage from './components/Like/LikesPage.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/bookmarks', name: 'Bookmarks', component: BookmarksPage},
  {path: '/likes', name: 'Likes', component: LikesPage},
  {path: '/event_announcements', name: 'EventAnnouncements', component: EventAnnouncementsPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === 'Bookmarks' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Bookmarks and is not signed in
      return;
    }

    if (to.name === 'EventAnnouncements' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Bookmarks and is not signed in
      return;
    }

    if (to.name === 'Likes' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Bookmarks and is not signed in
      return;
    }
  }

  next();
});

export default router;
