import Vue from 'vue';
import Vuex, { mapActions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    allBookmarkedFreetIds: [], // the freetIds of all of the freets that are bookmarked by this user
    bookmarkedFreets: [], // all of the bookmarked freets
    freetIdToBookmarkId: new Map(),

    eventAnnouncements: [], // All event announcements created in the app
    freetsAssociatedWithEvents: [],
    freetIdToEvent: new Map(),

    allLikedFreetIds: [], // the freetIds of all of the freets that are bookmarked by this user
    likedFreets: [], // all of the bookmarked freets
    freetIdToLikeId: new Map(),
    likeCounts: [],
  },
  getters: {
    getFreetById: (state) => (freetId) => {
      return state.freets.find(freet => freet._id === freetId)
    },
    getEventByFreetId: (state) => (freetId) => {
      return state.eventAnnouncements.find(event => event.associatedFreet === freetId)
    }
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },

    // bookmarks
    async refreshBookmarks(state) {
      // console.log('refreshBookmarks');

      const options = {
        method: 'GET', headers: {'Content-Type': 'application/json'}
      };

      const res = await fetch(`/api/bookmark?username=${state.username}`, options).then(async r => r.json());

      const theseIds = [];
      const theseFreets = [];
      const thisMapping = new Map();
    
      for (const bookmarkResponse of res) {
        theseIds.push(bookmarkResponse.freet);
        thisMapping.set(bookmarkResponse.freet, bookmarkResponse._id);
      }

      for (const freet of state.freets) {
        if (theseIds.includes(freet._id)) {
          theseFreets.push(freet);
        }
      }

    state.allBookmarkedFreetIds = theseIds;
    state.bookmarkedFreets = theseFreets;
    state.freetIdToBookmarkId = thisMapping;
  },

  // likes
  async refreshLikes(state) {
    // console.log('refreshBookmarks');

    const options = {
      method: 'GET', headers: {'Content-Type': 'application/json'}
    };

    const res = await fetch(`/api/like?username=${state.username}`, options).then(async r => r.json());

    const theseIds = [];
    const theseFreets = [];
    const thisMapping = new Map();
    const theseLikeCounts = [];

    for (const likeResponse of res) {
      theseIds.push(likeResponse.freet);
      thisMapping.set(likeResponse.freet, likeResponse._id);
    }

    for (const freet of state.freets) {
      if (theseIds.includes(freet._id)) {
        theseFreets.push(freet);
      }
      const url = `/api/like/count?freetId=${freet._id}`;
      const res = await fetch(url).then(async r => r.json());
      theseLikeCounts.push({freetId: freet._id, count: res.likeCount});
    }

  state.allLikedFreetIds = theseIds;
  state.likedFreets = theseFreets;
  state.freetIdToLikeId = thisMapping;
  state.likeCounts = theseLikeCounts;
},

  // Event Announcements
  updateEventsFilter(state, filter) {
    /**
     * Update the stored event announcements filter to the specified one.
     * @param filter - Username of the user to filter events by
     */
    state.eventsFilter = filter;
  },
  updateEventAnnouncements(state, events) {
    /**
     * Update the stored event announcements to the provided event announcements.
     * @param events - Event Announcements to store
     */
    state.eventAnnouncements = events;

    // Record the freetIds of the freets associated with events
    const theseAssociatedFreets = [];
    const thisMapping = new Map();

    for (const event of events) {
      theseAssociatedFreets.push(event.associatedFreet)
      thisMapping.set(event.associatedFreet, event);
    }

    state.freetsAssociatedWithEvents = theseAssociatedFreets;
    state.freetIdToEvent = thisMapping;
  },
  async refreshEventAnnouncements(state) {
    /**
     * Request the server for the currently available freets.
     */
    // TODO - is this a valid route?  Need to carry over changes to starter code?
    state.eventsFilter = null;
    
    const options = {
      method: 'GET', headers: {'Content-Type': 'application/json'}
    };

    const res = await fetch(`/api/events`, options).then(async r => r.json());

    state.eventAnnouncements = res;

    // Record the freetIds of the freets associated with events
    const theseAssociatedFreets = [];
    const thisMapping = new Map();

    for (const eventResponse of res) {
      theseAssociatedFreets.push(eventResponse.associatedFreet)
      thisMapping.set(eventResponse.associatedFreet, eventResponse);
    }

    state.freetsAssociatedWithEvents = theseAssociatedFreets;
    state.freetIdToEvent = thisMapping;
  },

  


  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
