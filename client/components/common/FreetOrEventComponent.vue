<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <EventAnnouncementComponent
    v-if="isEvent"
    :event="associatedEvent"
  />
  <FreetComponent
    v-else
    :freet="freet"
  />
</template>

<script>
import EventAnnouncementComponent from '@/components/EventAnnouncements/EventAnnouncementComponent.vue' 
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'FreetOrEventComponent',
  components: {EventAnnouncementComponent, FreetComponent},
  props: {
    // Data from the stored event
    freet: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState([
            'freetIdToEvent',
            'freetsAssociatedWithEvents',
            'eventAnnouncements'
        ]),
    isEvent() {
      return this.freetsAssociatedWithEvents.includes(this.freet._id);
    },
    associatedEvent() {
      return this.eventAnnouncements.find(event => event.associatedFreet === this.freet._id)
    }
  },
  async mounted() {
    this.$store.commit('refreshEventAnnouncements');
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
