<!-- Page that displays all freets liked by this user -->

<template>
  <main>
    <section>
      <header>
        <h2>Viewing @{{ $store.state.username }}'s Likes</h2>
      </header>
    </section>
    <section>
      <section
        v-if="$store.state.allLikedFreetIds.length"
      >
        <FreetOrEventComponent
          v-for="freet in $store.state.likedFreets"
          :key="freet._id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No liked freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetOrEventComponent from '@/components/common/FreetOrEventComponent.vue';
// import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetOrEventComponent},
  mounted() {
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
