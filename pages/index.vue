<template>
  <div>
    <file-pond
      ref="pond"
      :files="myFiles"
      :accepted-file-types="fileType"
      name="source"
      label-idle="Drop files here..."
      allow-multiple="true"
      server="/api/convert"/>
  </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from 'vue-filepond'
// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Create component
const FilePond = vueFilePond()

export default {
  components: {
    FilePond
  },
  data: function() {
    return {
      myFiles: '',
      fileType: 'video/*'
    }
  },
  methods: {
    handleFilePondInit: function() {
      console.log('FilePond has initialized')

      // FilePond instance methods are available on `this.$refs.pond`
    }
  }
}
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
