<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->


<template>
  <article
    v-if="!underlyingFreet" 
    class="loading" 
  />
  <article
    v-else
    class="card bg-accent text-accent-content shadow-2xl border-solid border-black border"
  >
    <div class="card-body">
      <div v-if="isCancelled" class="badge badge-warning">CANCELLED</div>
      <div class="badge badge-primary">EVENT ANNOUNCEMENT</div>
      <h2 class="card-title">@{{ underlyingFreet.author }}</h2>
      <p> <span class="font-bold">Event Title:</span>   {{ event.eventSubject }}</p>
      <p> <span class="font-bold">Date and Time:</span>  {{ event.eventDate }}</p>
      <p> <span class="font-bold">Event Location:</span>  {{ event.eventLocation }}</p>
      <div v-if="!underlyingFreet" class="loading" />
      <div v-else>
        <p> {{ underlyingFreet.content }}</p>
      </div>
      <div class="card-actions justify-left flex-row space-x-4">
        <div
          class="btn-group"
          v-if="$store.state.username" 
        >
          <LikeButton
            :freet="underlyingFreet"
          />
        </div>
        <div
          class="btn-group"
          v-if="$store.state.username" 
        >
          <bookmarkButton
            :key="componentKey"
            :freet="underlyingFreet"  
          />
        </div>
        <div
          v-if="$store.state.username === underlyingFreet.author"
          class="btn-group"
        >
          <button class="btn btn-warning text-warning-content"
            v-if="!isCancelled"
            @click="cancelEvent"
          >
            Cancel Event
          </button>
        </div>
        <section class="alerts">
          <article
            v-for="(status, alert, index) in alerts"
            :key="index"
            :class="status"
          >
            <p>{{ alert }}</p>
          </article>
        </section>
      </div>
    </div>
  </article>
</template>

<!-- <template>
  <article
    class="event"
  >
    <header
      v-if="!underlyingFreet"
      class="loading"
    />
    <header
      v-else 
    >
      <div
        v-if="isCancelled"
        id="cancellationStatus"
      >
        <h4>CANCELLED</h4>
      </div>
      <h3
        v-else
      >
        @{{ underlyingFreet.author }}
      </h3>
      <div
        v-if="$store.state.username" 
        id="likeAndBookmark"
      >
        <LikeButton
          :freet="underlyingFreet"
        />
        <bookmarkButton 
          :key="componentKey"
          :freet="underlyingFreet"  
        />
      </div>
      <div
        v-if="$store.state.username === underlyingFreet.author"
        class="actions"
      >
        <button 
          v-if="!isCancelled"
          @click="cancelEvent"
        >
          Cancel Event
        </button>
      </div>
    </header>
    <p
      class="info"
    >
      Event Title:  {{ event.eventSubject }}
    </p>
    <p
      class="info"
    >
      Date and Time:  {{ event.eventDate }}
    </p>
    <p
      class="info"
    >
      Event Location:  {{ event.eventLocation }}
    </p>
    <div
      v-if="!underlyingFreet"
      class="loading"
    />
    <div
      v-else 
    >
      <p
        class="content"
      >
        {{ underlyingFreet.content }}
      </p>
      <p class="info">
        Posted at {{ underlyingFreet.dateModified }}
      </p>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template> -->

<script>
import BookmarkButton from '@/components/Bookmark/BookmarkButton.vue'
import LikeButton from '@/components/Like/LikeButton.vue'
import { mapState } from 'vuex'

export default {
  name: 'EventAnnouncementComponent',
  components: {BookmarkButton, LikeButton},
  props: {
    // Data from the stored event
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alerts: {}, // Displays success/error messages encountered during freet modification
      componentKey: 0, 
    };
  },
  computed: {
    ...mapState([
      'freets',
    ]),
    underlyingFreet() {
      return this.freets.find(freet => freet._id === this.event.associatedFreet);
      // console.log('this', this);
      // console.log('this.$store.getters', this.$store.getters);
      // const response = this.$store.getters.getFreetById(this.event.associatedFreet);
      // console.log('getter response', response);
      // return response;
      // return this.$store.getters.getFreetById(this.event.associatedFreet);
    },
    isCancelled() {
      return this.event.cancelled === 'true';
    }
  },
  methods: {
    cancelEvent() {
      /**
       * Cancels this event.
       */
      const params = {
        method: 'PUT',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully cancelled event!', status: 'success'
          });
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
       * Submits a request to the event's endpoint
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
        const r = await fetch(`/api/events/${this.event._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshEventAnnouncements');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      // this.forceRenderer();
    }
  }
};
</script>

<style scoped>
.event {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
