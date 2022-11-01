<!-- Reusable component representing a single bookmark button and its actions -->

<template>
  <div>
    <button 
      v-if="!bookmarked"
      @click="addBookmark"
    >
      🔖 Add Bookmark 
    </button>
    <button 
      v-if="bookmarked"
      @click="removeBookmark"
    >
      Remove Bookmark 
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
      bookmarkId: '', 
    }
  },
  async mounted() {
    // Check whether this freet is bookmarked by this user
    const options = {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    };

    const res = await fetch(`/api/bookmark?username=${this.$store.state.username}`, options).then(async r => r.json());

    for (const bookmarkResponse in res) {
      if (bookmarkResponse.freet === this.freet.id) {
        this.bookmarked = true;
        this.bookmarkId = bookmarkResponse._id;
        console.log('setting bookmarkId to', bookmarkResponse._id);
      }
    }

    console.log('freetId', this.freet.id);
    console.log('res', res);
    console.log('res._id', res._id);
    console.log('bookmarked', this.bookmarked);
    console.log('bookmarkId', this.bookmarkId);

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
      this.bookmarkId = res.bookmark._id;
      console.log('on add bookmark, setting bookmarkId to', this.bookmarkId)
    },
    addBookmark_old() {
      const params = {
        method: 'POST',
        message: 'Successfully added bookmark!',
        body: JSON.stringify({ freetId: this.freet._id }),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      }
      this.request(params);
      this.bookmarked = true;
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
      console.log('calling delete bookmark with bookmark id', this.bookmarkId);
      this.request(params);
      this.bookmarked = false;
      this.bookmarkId = '';
    },
    async checkBookmarkStatus() {
      // Check whether this freet is bookmarked by this user
      const options = {
        method: 'GET', headers: {'Content-Type': 'application/json'}
      };

      const res = await fetch(`/api/bookmark?username=${this.$store.state.username}`, options).then(async r => r.json());

      for (const bookmarkResponse in res) {
        if (bookmarkResponse.freet === this.freet.id) {
          this.bookmarked = true;
        }
      }

    console.log('freetId', this.freet.id);
    console.log('res', res);
    console.log('bookmarked', this.bookmarked);
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

        // this.editing = false;
        // this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
    
    
    
    
    // async request(params) {
    //   /**
    //    * Submits a request to the bookmark endpoint
    //    * @param params - Options for the request
    //    * @param params.body - Body for the request, if it exists
    //    * @param params.callback - Function to run if the the request succeeds
    //    */
    //   const options = {
    //     method: params.method, headers: {'Content-Type': 'application/json'}
    //   };
    //   if (params.body) {
    //     options.body = params.body;
    //   }

    //   try {
    //     const r = await fetch(`/api/bookmark/`, options);
    //     if (!r.ok) {
    //       const res = await r.json();
    //       throw new Error(res.error);
    //     }

    //     // this.editing = false;
    //     this.$store.commit('refreshFreets');

    //     params.callback();
    //   } catch (e) {
    //     this.$set(this.alerts, e, 'error');
    //     setTimeout(() => this.$delete(this.alerts, e), 3000);
    //   }
    // }
  }
};
</script>
