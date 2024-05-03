<template>
  <ion-page>
    <ion-header >
      <ion-toolbar>
        <ion-title class="header-title">Visita-Me</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="background-landing">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="start-button-container">
        <ion-button href="/location" size="large" class="start-button">Start</ion-button>
      </div>
      <input type="file" id="fileInput" accept ="image/jpg, image/jpeg, image/png"  multiple ></input>
      <button @click="transcode">Start</button>
      <div>
      <video :src="video" controls :width=screenWidth :height=screenHeight></video>
    </div> 
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import type { LogEvent } from '@ffmpeg/ffmpeg/dist/esm/types'
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { defineComponent,ref } from 'vue';


export default defineComponent({
  setup(){
    const ffmpeg = new FFmpeg()
    const message = ref('Click Start to Transcode')
    const video = ref('')
    async function transcode() {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const files = fileInput.files;
      if (!files || files.length === 0) {
        alert('Please select image files.');
        return;
      }
      const imageFiles = Array.from(files) as File[];
      // Store image files
      message.value = 'Loading ffmpeg-core.js'
      ffmpeg.on('log', ({ message: msg }: LogEvent) => {
        message.value = msg
      })

      await ffmpeg.load({
        coreURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
      })
      for(let i = 0;i<imageFiles.length;i++){
        const arrayBuffer = await fetchFile(imageFiles[i]);
        const uint8Array =  arrayBuffer as Uint8Array;
        await ffmpeg.writeFile(`input${i}.jpg`, arrayBuffer as Uint8Array);  
      }
      await ffmpeg.exec(['-t','30','-r','0.2','-i', `input%d.jpg`, '-vcodec','libx264', "-vf", "format=yuv420p",'output.mp4']);
      const data = await ffmpeg.readFile('output.mp4');
      video.value=URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    }
    return {
      video,
      message,
      transcode
    }
  },
  data() {
    return{
      baseURL: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm',
      imageFiles: [],
      screenWidth: window.innerWidth/2,
      screenHeight: window.innerHeight/2,

    }

  },
  mounted() {
    const inputFile = document.getElementById('fileInput') as HTMLInputElement;
inputFile.addEventListener('change', async (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    for(let i=0; i< files.length;i++){
      this.imageFiles.push(files[i]);
    }
  }
});
  },
  methods:{
    async convertToVideo() {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const files = fileInput.files;
      if (!files || files.length === 0) {
        alert('Please select image files.');
        return;
      }
      const imageFiles = Array.from(files) as File[];
      // Store image files
      (window as any).imageFiles = imageFiles;
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
      })
      const inputFiles = imageFiles.map((_, index) => '-i input${index}.jpg').join(' ');
      console.log(inputFiles)
      await ffmpeg.exec(['-framerate', '30', inputFiles, 'output.mp4']);
      const data = ffmpeg.readFile('output.mp4');
      video.value = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }))
      
    },
    
  }
});

</script>
