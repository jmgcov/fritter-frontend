<!-- Reusable component representing a single like button and its actions -->

<template>
  <button class="btn bg-secondary text-secondary-content"
    v-if="$store.state.inReaderMode"
    @click="exitReaderMode"
  >
    EXIT READER MODE
  </button>
  <button 
    v-else
    class="btn bg-primary text-primary-content"
    @click="enterReaderMode"
  >
    ENTER READER MODE
  </button>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: 'ReaderModeButton',
  // async mounted() {
  //   // check if the user is in readerMode
    
  //   this.isLiked = this.$store.state.allLikedFreetIds.includes(this.freet._id);
  //   this.loading = false;
    
  //   // set the like count
  //   const countObject = this.$store.state.likeCounts.find(countObject => countObject.freetId === this.freet._id);
  //   this.likeCount = countObject.likeCount;

  //   const allLikedFreetIds = this.$store.state.allLikedFreetIds;

  //   if (allLikedFreetIds.includes(this.freet._id)) {
      
  //     const options = {
  //         method: 'GET', headers: {'Content-Type': 'application/json'}
  //     };

  //     const res = await fetch(`/api/like?username=${this.$store.state.username}`, options).then(async r => r.json());

  //     for (const likeResponse in res) {
  //       if (likeResponse.freet === this.freet._id) {
  //         this.likeId = likeResponse.freet;
  //       }
  //     }

  //     // const countOptions = {
  //     //     method: 'GET', headers: {'Content-Type': 'application/json'}
  //     // };

  //     // const countRes = await fetch(`/api/like/count?freetId=${this.freet._id}`, countOptions).then(async r => r.json());
  //     // this.likeCount = countRes.likeCount;
  //   }
  // },
  methods: {
    async enterReaderMode() {
      // this.likeCount += 1;
      // this.isLiked = true;

      // const params = {
      //   method: 'POST',
      //   message: 'Successfully added like!',
      //   body: JSON.stringify({ freetId: this.freet._id }),
      //   callback: () => {
      //     this.$set(this.alerts, params.message, 'success');
      //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
      //   }
      // }

      // const options = {
      //   method: params.method, headers: {'Content-Type': 'application/json'}
      // };
      // if (params.body) {
      //   options.body = params.body;
      // }

      // const r = await fetch(`/api/like`, options);
      // const res = await r.json();
      // this.likeId = res.like._id;

      // console.log('from add like');
      this.$store.commit('updateReaderMode', true);
      this.$router.push({name: 'ReaderMode'});
    },    
    async exitReaderMode() {
      // this.likeCount += 1;
      // this.isLiked = true;

      // const params = {
      //   method: 'POST',
      //   message: 'Successfully added like!',
      //   body: JSON.stringify({ freetId: this.freet._id }),
      //   callback: () => {
      //     this.$set(this.alerts, params.message, 'success');
      //     setTimeout(() => this.$delete(this.alerts, params.message), 3000);
      //   }
      // }

      // const options = {
      //   method: params.method, headers: {'Content-Type': 'application/json'}
      // };
      // if (params.body) {
      //   options.body = params.body;
      // }

      // const r = await fetch(`/api/like`, options);
      // const res = await r.json();
      // this.likeId = res.like._id;

      // console.log('from add like');
      this.$store.commit('updateReaderMode', false);
      this.$router.push({name: 'Home'});
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      
      const likeId = this.$store.state.freetIdToLikeId.get(this.freet._id);

      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/like/${likeId}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
