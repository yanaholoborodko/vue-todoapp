<template></template>

<script>
export default {
  // this will be 'created'  whenever we click on logout button
  created() {
    this.$store.dispatch("destroyToken").then(response => {
      this.$router.push({ name: "home" });
    });
  }
};
</script>