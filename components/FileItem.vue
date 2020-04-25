<template>
  <v-card>
    <v-card-actions>
      <v-icon @click="remove()">far fa-times-circle</v-icon>
      {{ fileName }}
      <v-spacer/>
      <v-btn 
        :show="!converted || converting"
        outline
        @click="upload()" >Upload</v-btn>
      <v-btn 
        :show="converted"
        outline
        @click="upload()" >Download</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    inputFile: {
      type: File,
      required: true,
      default: null
    }
  },
  data: function() {
    return {
      converting: false,
      converted: false,
      convertedFileName: ''
    }
  },
  computed: {
    fileName: function() {
      return this.inputFile.name
    }
  },
  methods: {
    upload: function() {
      this.converting = true
      const formData = new FormData()
      formData.append('source', this.inputFile)
      fetch('/api/convert', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(response => {
          this.convertedFileName = response
          console.log('Success:', JSON.stringify(response))
        })
      console.log('upload!')
      //HTTP POST use fetch api
      this.converting = false
      this.converted = true
    },
    remove: function() {
      this.$emit('remove')
    },
    download: function() {
      console.log('download start!')
      fetch(`/download/${test}`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
    }
  }
}
</script>
