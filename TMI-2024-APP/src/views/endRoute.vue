<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-label>¡Enhorabuena, has acabado el recorrido!</ion-label>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-justify">
            <ion-label>Escoge una foto de cada uno de los lugares que has visitado para obtener un vídeo
              recopilatorio</ion-label>
            <ion-input type="file" id="fileInput" accept="image/jpeg" multiple></ion-input>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-button @click="transcode" shape="round">Generar vídeo</ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center">
            <video id="video" controls :width=screenWidth :height=screenHeight style="display:none;"></video>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-label>Tu recorrido</ion-label>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-img :src=getMap()></ion-img>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-button @click="navigateToRoute" class="button_container" shape="round" size="large">Nueva Ruta</ion-button>
            </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">

import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonButton, useIonRouter
} from '@ionic/vue';

import { ciudad_export, latitud_export, longitud_export } from "./Tab2Page.vue";


import { onMounted, nextTick } from "vue";
import { GoogleMap } from "@capacitor/google-maps";

import { defineComponent, ref } from 'vue';

import { API_KEY } from "../key";

import { places_export } from './SiteListPage.vue';
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import axios from 'axios';

const navigateToRoute = () => {
  // Utiliza el método push del enrutador para navegar a la ruta deseada
  this.route.push('/landing');

};

const mapRef = ref<HTMLElement>();
let newMap: GoogleMap;
const lineId = ref<string[] | undefined>();

//https://github.com/aaronksaunders/ionic-vue-capacitor-google-maps-app-1/blob/main/src/views/MyMap.vue
onMounted(async () => {
  console.log("mounted ", mapRef.value);
  await nextTick();
  await createMap();
  await addPolyLine();
});

async function createMap() {
  if ( typeof latitud_export.value === 'number' && typeof longitud_export.value === 'number') {
    newMap = await GoogleMap.create({
      id: "my-cool-map",
      element: document.getElementById("map") as HTMLElement,
      apiKey: API_KEY,
      config: {
        center: {
          lat: latitud_export.value,
          lng: longitud_export.value,
        },
        zoom: 12,
      },
    });
  }

  //Como agregar un punto
  /*
  await newMap.addMarker({
    coordinate: {
      lat: 33.6,
      lng: -130.9
    }
  });
  */
};

//https://www.youtube.com/watch?v=S6FkvoYEGno
async function addPolyLine() {
  const lines = [
    {
      path: [
        {
          lat: places_export.value[0].geometry.location.lat,
          lng: places_export.value[0].geometry.location.lng
        },
        {
          lat: places_export.value[1].geometry.location.lat,
          lng: places_export.value[1].geometry.location.lng
        },
        {
          lat: places_export.value[2].geometry.location.lat,
          lng: places_export.value[2].geometry.location.lng
        },
        {
          lat: places_export.value[3].geometry.location.lat,
          lng: places_export.value[3].geometry.location.lng
        },
        {
          lat: places_export.value[4].geometry.location.lat,
          lng: places_export.value[4].geometry.location.lng
        }
      ],
    },
  ];

  await newMap.addPolylines(lines);
}
const ffmpeg = new FFmpeg()
const message = ref('Click Start to Transcode')
const video = ref('')
export default defineComponent({
  components: {
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent, IonButton, IonCard,
    IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent,
  },
  data() {
    return {
      baseURL: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm',
      imageFiles: [],
      screenWidth: window.innerWidth * 0.85,
      screenHeight: window.innerHeight * 0.85,
      route: useIonRouter(),
      latitud:latitud_export.value,
      longitud:longitud_export.value,
      places:places_export.value

    }
  },
  async mounted() {
    const inputFile = document.getElementById('fileInput') as HTMLInputElement;
    inputFile.addEventListener('change', async (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.imageFiles.push(files[i]);
        }
      }
    });
  },
  methods: {
    navigateToRoute() {
      // Utiliza el método push del enrutador para navegar a la ruta deseada
      this.route.push('/landing');
    },
    async transcode() {
      if (this.imageFiles.length===0 || this.imageFiles.length > 6) {
        alert('Por favor, selecciona hasta 5 imágenes');
      }
      else {
        const imageFiles = Array.from(this.imageFiles) as File[];
        
        await ffmpeg.load({
          coreURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${this.baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
        })
        for (let i = 0; i < imageFiles.length; i++) {
          const arrayBuffer = await fetchFile(imageFiles[i]);
          const uint8Array = arrayBuffer as Uint8Array;
          await ffmpeg.writeFile('input0.jpg',await fetchFile('../../imgs/logo.jpg'));
          await ffmpeg.writeFile(`input${i+1}.jpg`, arrayBuffer as Uint8Array);
          await ffmpeg.writeFile('happy.mp3', await fetchFile('../../audio/happy.mp3') as Uint8Array)
        }
        let videoLength=5*(imageFiles.length+1);
        await ffmpeg.exec(['-t', videoLength.toString(), '-r', '0.2', '-i', `input%d.jpg`,'-t',videoLength.toString(),'-i', 'happy.mp3','-codec:a', 'mp3','-map','0:v:0','-map','1:a:0','-vcodec', 'libx264', "-vf", "format=yuv420p", 'video.mp4']);
        const data = await ffmpeg.readFile('video.mp4');
        let videoElement = document.getElementById('video') as HTMLVideoElement;
        videoElement.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        videoElement.style.display="block";
        console.log("video finished")
      }
    },
    getMap(){
      const url= "/api/maps/api/staticmap?center="+ciudad_export.value+"&zoom=12&size=300x300"+
      "&markers=color:red%7Clabel:1%7C"+places_export.value[0].geometry.location.lat+","+places_export.value[0].geometry.location.lng+
      "&markers=color:red%7Clabel:2%7C"+places_export.value[1].geometry.location.lat+","+places_export.value[1].geometry.location.lng+
      "&markers=color:red%7Clabel:3%7C"+places_export.value[2].geometry.location.lat+","+places_export.value[2].geometry.location.lng+
      "&markers=color:red%7Clabel:4%7C"+places_export.value[3].geometry.location.lat+","+places_export.value[3].geometry.location.lng+
      "&markers=color:red%7Clabel:5%7C"+places_export.value[4].geometry.location.lat+","+places_export.value[4].geometry.location.lng+
      "&path=color:0xff0000ff%7Cweight:5%7C"
      +places_export.value[0].geometry.location.lat+","+places_export.value[0].geometry.location.lng+"%7C"
      +places_export.value[1].geometry.location.lat+","+places_export.value[1].geometry.location.lng+"%7C"
      +places_export.value[2].geometry.location.lat+","+places_export.value[2].geometry.location.lng+"%7C"
      +places_export.value[3].geometry.location.lat+","+places_export.value[3].geometry.location.lng+"%7C"
      +places_export.value[4].geometry.location.lat+","+places_export.value[4].geometry.location.lng
      +"&key="+API_KEY;
      return url;
    }

  }
});

</script>

<style>
.img_recorrido {
  display: block;
  margin: 0 auto;
  width: 60%;
  margin-top: 10%;
  margin-bottom: 10%;
}

.video_recorrido {
  display: block;
  margin: 0 auto;
  width: 50%;
  margin-top: 10%;
  margin-bottom: 10%;
}

.button_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  /* Ajusta la altura según tus necesidades */
}

capacitor-google-map {
  display: inline-block;
  width: 275px;
  height: 400px;
}
</style>