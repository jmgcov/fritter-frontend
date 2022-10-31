<!-- Reusable component representing a single bookmark button and its actions -->


<!-- 🔖 Add Bookmark --> 

<template>
  <button @click="addBookmark">
    🔖 Add Bookmark 
  </button>
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
  methods: {
    addBookmark() {
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
    },
    async bookmarkRequest(params) {
      /**
       * Submits a request to the bookmark endpoint
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
        const r = await fetch(`/api/bookmark/`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        // this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
