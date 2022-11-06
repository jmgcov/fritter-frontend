<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateEventAnnouncementForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/events',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'eventDate', label: 'Date and Time', value: ''},
        {id: 'eventSubject', label: 'Title', value: ''},
        {id: 'eventLocation', label: 'Location', value: ''},
        {id: 'eventDescription', label: 'Description', value: ''},
      ],
      title: 'Create an event announcement',
      refreshFreets: true,
      refreshEvents: true,
      callback: () => {
        const message = 'Successfully created an event announcement!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
