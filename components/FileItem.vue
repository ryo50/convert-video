<template>
  <v-card>
    <v-card-actions>
      <v-btn 
        class="mr-3"
        text 
        icon>
        <v-icon 
          @click="remove()">far fa-times-circle</v-icon>
      </v-btn>
      {{ fileName }}
      <v-spacer/>
      <v-btn 
        v-show="!converted"
        :loading="converting"
        outline
        @click="upload()" >Upload</v-btn>
      <v-btn 
        v-show="converted"
        outline
        @click="download()" >Download</v-btn>
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
    test: async function() {
      const response = await fetch('/api/test')
      const resJson = await response.json()
      console.log(response)
      console.log(resJson.message)
      console.log(JSON.stringify(resJson))
    },
    upload: async function() {
      this.converting = true
      const formData = new FormData()
      formData.append('source', this.inputFile)
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })
      const response = await res.json()
      console.log('Success:' + JSON.stringify(response))
      console.log('Success:' + response.fileName)

      this.convertedFileName = response.fileName
      console.log('upload!')
      this.converting = false
      this.converted = true
    },
    remove: function() {
      this.$emit('remove')
    },
    download: async function() {
      console.log('download start!')
      console.log('filename => ' + this.convertedFileName)
      const response = await fetch(`/api/download/${this.convertedFileName}`)
      console.log(response)
      const convertedFile = await response.blob()
      const url = window.URL.createObjectURL(convertedFile)
      const link = document.createElement('a')
      link.download = this.fileName
      link.href = url
      link.click()
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>
