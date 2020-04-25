<template>
  <div>
    <v-btn 
      color="success" 
      @click="onClick()">Upload File Select</v-btn>
    <input 
      id="file-upload" 
      type="file" 
      name="file-upload" 
      style="display: none;" 
      @change="handleFiles($event)">
    <li 
      v-for="(file, index) in uploadFiles" 
      :key="file.size">
      <file-item 
        :input-file="file" 
        @remove="removeItem(index)"/></li>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'
import FileItem from '@/components/FileItem'

export default {
  components: {
    FileItem
  },
  data: function() {
    return {
      uploadFiles: []
    }
  },
  methods: {
    onClick: function() {
      console.log('onClick')
      document.getElementById('file-upload').click()
    },
    handleFiles: function(e) {
      console.log(e)
      let files = e.target.files || e.dataTransfer.files
      console.log(files)
      this.uploadFiles.push(files[0])
    },
    removeItem: function(index) {
      console.log('remove item')
      this.uploadFiles.splice(index, 1)
    }
  }
}
</script>
