<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>event announcements</h2>
      </header>
      <CreateEventAnnouncementForm />
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all Event Announcements
          </h2>
        </div>
      </header>
      <section
        v-if="$store.state.eventAnnouncements.length"
      >
        <EventAnnouncementComponent
          v-for="event in $store.state.eventAnnouncements"
          :key="event._id"
          :event="event"
        />
      </section>
      <article
        v-else
      >
        <h3>No Event Announcements found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import EventAnnouncementComponent from '@/components/EventAnnouncements/EventAnnouncementComponent.vue';
import CreateEventAnnouncementForm from '@/components/EventAnnouncements/CreateEventAnnouncementForm.vue';

export default {
  name: 'EventAnnouncementsPage',
  components: {EventAnnouncementComponent, CreateEventAnnouncementForm},
  mounted() {
    // this.$refs.getEventAnnouncementsForm.submit();
    this.$store.commit('updateFilter', null);
    this.$store.commit('refreshFreets');
    this.$store.commit('refreshEventAnnouncements');
    this.$store.commit('refreshLikes');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
