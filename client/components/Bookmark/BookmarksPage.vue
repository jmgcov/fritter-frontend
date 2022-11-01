<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <h2>Viewing @{{ $store.state.username }}'s Bookmarks</h2>
      </header>
    </section>
    <section>
      <section
        v-if="$store.state.allBookmarkedFreetIds.length"
      >
        <FreetComponent
          v-for="freet in $store.state.bookmarkedFreets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No bookmarked freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
// import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm},
  mounted() {
    console.log("Position 1")
    console.log("filter", this.$store.state.filter);
    this.$store.commit('updateFilter', null);
    console.log("filter should be updated", this.$store.state.filter);
    this.$store.commit('refreshFreets');
    this.$store.commit('refreshBookmarks');
    // this.$refs.getFreetsForm.submit();
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
