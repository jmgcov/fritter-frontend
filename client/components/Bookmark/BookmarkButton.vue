<!-- Reusable component representing a single bookmark button and its actions -->

<template>
  <div>
    <button 
      v-if="$store.state.allBookmarkedFreetIds.includes(freet._id)"
      @click="removeBookmark"
    >
      Remove Bookmark 
    </button>
    <button 
      v-else
      @click="addBookmark"
    >
      🔖 Add Bookmark 
    </button>
  </div>
</template>

<script>
export default {
  name: 'BookmarkButton',
  props: {
    freet: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      bookmarked: false, // Whether this freet is bookmarked by this user
    }
  },
  async mounted() {
    // Check whether this freet is bookmarked by this user
    console.log("Calling refresh bookmarks from mounted");
    this.$store.commit('refreshBookmarks');

    const allBookmarkedFreetIds = this.$store.state.allBookmarkedFreetIds;
    console.log('allBookmarkedFreetIds from mounted', allBookmarkedFreetIds);
    console.log('this freet id', this.freet._id);

    if (allBookmarkedFreetIds.includes(this.freet._id)) {
      this.bookmarked = true;
    }

    console.log('status of bookmarked', this.bookmarked)

    
    // const options = {
    //     method: 'GET', headers: {'Content-Type': 'application/json'}
    // };

    // const res = await fetch(`/api/bookmark?username=${this.$store.state.username}`, options).then(async r => r.json());

    // for (const bookmarkResponse in res) {
    //   if (bookmarkResponse.freet === this.freet.id) {
    //     this.bookmarked = true;
    //     this.bookmarkId = bookmarkResponse._id;
    //   }
    // }
  },
  methods: {
    async addBookmark() {
      const params = {
        method: 'POST',
        message: 'Successfully added bookmark!',
        body: JSON.stringify({ freetId: this.freet._id }),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      }

      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      const r = await fetch(`/api/bookmark`, options);
      const res = await r.json();

      this.bookmarked = true;
      this.$store.commit('refreshBookmarks');
    },
    removeBookmark() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully removed bookmark!', status: 'success'
          });
        }
      };
      this.request(params);
      this.bookmarked = false;
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        console.log("now deleting");
        console.log('bookmarkId', this.bookmarkId)
        const r = await fetch(`/api/bookmark/${this.bookmarkId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.$store.commit('refreshBookmarks');
    }
  }
};
</script>
