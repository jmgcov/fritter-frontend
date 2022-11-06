<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetEventAnnouncementsForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.eventsFilter};
  },
  methods: {
    async submit() {
      const url = this.value ? `/api/events?author=${this.value}` : '/api/events';
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateEventsFilter', this.value);
        this.$store.commit('updateEventAnnouncements', res);
      } catch (e) {
        if (this.value === this.$store.state.eventsFilter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateEventsFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshEventAnnouncements');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.eventsFilter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  }
};
</script>
