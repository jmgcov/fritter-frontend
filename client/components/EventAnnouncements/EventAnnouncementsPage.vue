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
            <span v-if="$store.state.eventsFilter">
              by @{{ $store.state.eventsFilter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetEventAnnouncementsForm
            ref="getEventAnnouncementsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get event announcements"
            user="$store.state.username"
          />
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
import GetEventAnnouncementsForm from '@/components/EventAnnouncements/GetEventAnnouncementsForm.vue';

export default {
  name: 'EventAnnouncementsPage',
  components: {EventAnnouncementComponent, GetEventAnnouncementsForm, CreateEventAnnouncementForm},
  mounted() {
    this.$refs.getEventAnnouncementsForm.submit();
    // this.$store.commit('refreshFreets');
    // this.$store.commit('refreshEventAnnouncements');
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
