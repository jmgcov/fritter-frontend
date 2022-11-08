<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <div
    class="card bg-base-100 shadow-2xl border-solid border-black border"
  >
    <div class="card-body">
      <h2 class="card-title">@{{ freet.author }}</h2>
      <textarea
        v-if="editing"
        class="textarea textarea-primary"
        :value="draft"
        @input="draft = $event.target.value"
      />
      <label 
        v-if="editing" 
        class="label" 
      >
        <span class="label-text-alt">{{ 140 - draft.length }}/140 characters remaining</span>
      </label> 
      <p
        v-if="!editing"
        class="content"
      >
        {{ freet.content }}
      </p>
      <div class="card-actions justify-left flex-row space-x-4">
        <div
          class="btn-group"
          v-if="$store.state.username" 
        >
          <LikeButton
            :freet="freet"
          />
        </div>
        <div
          class="btn-group"
          v-if="$store.state.username" 
        >
          <bookmarkButton
            :key="componentKey"
            :freet="freet"  
          />
        </div>
        <div 
          class="btn-group"
          v-if="$store.state.username === freet.author"
        >
          <button
            class="btn" 
            v-if="editing"
            @click="submitEdit"
          >
            Save changes  
          </button>
          <button
            class="btn"
            v-if="editing"
            @click="stopEditing"
          >
            Discard changes 
          </button>
          <button
            class="btn"
            v-if="!editing"
            @click="startEditing"
          >
            ✏️ Edit
          </button>
          <button class="btn" @click="deleteFreet">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookmarkButton from '@/components/Bookmark/BookmarkButton.vue'
import LikeButton from '@/components/Like/LikeButton.vue'

export default {
  name: 'FreetComponent',
  components: {BookmarkButton, LikeButton},
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      componentKey: 0, 
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    forceRenderer() {
      this.componentKey += 1;
      // The "forceRenderer" code in this component, which forces certain elements to rerender
      // when their state is affected indirectly by other actions (such as the automatic deletion of
      // a bookmark when the underlying freet is deleted), comes from the following source:
      // url: https://michaelnthiessen.com/force-re-render/
      // date retrieved:  11/01/2022
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.forceRenderer();
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
