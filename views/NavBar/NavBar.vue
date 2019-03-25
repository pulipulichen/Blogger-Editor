<template>
  <div class="non-invasive-web-style-framework">
    <div class="ui top fixed menu">
      <div class="item">
        <img src="icon.png" style="width: 35px; height: 35px;">
      </div>
      <a class="item">Features</a>
      <a class="item">Testimonials</a>
      <a class="item">Sign-in</a>
    </div>
    <h1> This is your first component in Vue </h1>
        <h3> {{ webpack }} </h3>
  </div>
</template>

<script>
    export default {
        name: "main-content",
        data: () => ({
            // reactive data property of the component.
            webpack: 'Powered by webpack!',
        }),
    }
</script>

<style src="./NavBar.less"  scoped></style>