<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="header-title">Lista de lugares a visitar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Visita-Me</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-item>
        <ion-label>Ubicación: Madrid</ion-label>
      </ion-item>
      <ion-item>
        <ion-list :inset="true" v-if="places.length > 0">
          <ion-label>Lista de lugares emblemáticos a visitar</ion-label>
          <ion-item v-for="(place, index) in places" :key="place.id">
            <ion-label :id="'click-trigger-' + index">{{ place.name }}</ion-label>
            <ion-button>{{ index }}</ion-button>
            <ion-popover :trigger="'click-trigger-' + index" trigger-action="click">
              <ion-label>{{ place.name }}
                <ion-label>UBICACION:<br>{{ place.vicinity }}</br>
                  <ion-img :src=imgLinks[index]></ion-img>
                </ion-label>
              </ion-label>
              <ion-button @click="takePicture(index)">Foto</ion-button>


            </ion-popover>

          </ion-item>
        </ion-list>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, useIonRouter, IonButton, IonImg, IonPopover } from '@ionic/vue';
import { defineComponent } from 'vue';
//import { location } from './Tab2Page.vue';
import axios from "axios"
import { API_KEY } from "../key"
import { Camera, CameraResultType } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
export default defineComponent({
  components: { IonPage },
  data() {
    return {
      api_key: API_KEY,
      lat: 40.4380981,
      lng: -3.8446862,
      keyword: "Sitios+emblematicos+de+Madrid",
      radius: "50000",
      numSites: 5,
      places: [],
      imgLinks: [],
      siteCoords: [],
      photoCoords: [],
    };
  },
  setup() {
    const router = useIonRouter();
    const push = () => {
      router.push('/locationDetails');
    };
    return { push };
  },
  mounted() {
    const URL = "/api/maps/api/place/nearbysearch/json?location=" + this.lat + "," + this.lng + "&keyword=" + this.keyword + "&radius=" + this.radius + "&key=" + API_KEY;
    axios.get(URL).then(response => {
      this.places = response.data.results.slice(0, this.numSites);
      for (let i = 0; i < this.places.length; i++) {
        this.siteCoords[i] = this.places[i].geometry.location;
        this.monumentPhoto(this.places[i].photos[0].photo_reference,i);
      }
      //console.log(this.imgLinks)
      //console.log(response.data.results)
    }).catch(error => {
      console.log(error.message);
    });

  },
  methods: {
    monumentPhoto(photo_ref: string, index:number) {
      const url = "/api/maps/api/place/photo?maxwidth=400&photo_reference=" + photo_ref + "&key=" + API_KEY;
      var xhr = new XMLHttpRequest();
      var vm = this;
      xhr.open('GET', url, true)
      xhr.onload = function () {
        vm.imgLinks[index]=xhr.responseURL.trim();
      };
      xhr.send(null);

    },
    async takePicture(id: number) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });

      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      var imageUrl = image.webPath;

      // Can be set to the src of an image now
      //imageElement.src = imageUrl;
      const url = "https://vision.googleapis.com/v1/images:annotate?key=" + API_KEY;
      const request = {
        requests: [
          {
            image: {
              content: image.base64String
            },
            features: [
              {
                type: 'LANDMARK_DETECTION'
              }
            ]
          }
        ]
      };
      await axios.post(url, request).then(response => {
        const coords = response.data.responses[0].landmarkAnnotations[0].locations[0].latLng;
        this.photoCoords[id] = coords;
        console.log(this.photoCoords)
        console.log(this.haversine(this.siteCoords[id],this.photoCoords[id]))
      }).catch(error => {
        console.log("Error al obtener la foto: " + error.message);
      });
    },
    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    },
    haversine(site1, site2) {
      const R = 6371000; // Radio de la Tierra en metros
      const phi1 = this.toRadians(site1.lat);
      const phi2 = this.toRadians(site2.latitude);
      const deltaPhi = this.toRadians(site2.latitude - site1.lat);
      const deltaLambda = this.toRadians(site2.longitude - site1.lng);

      const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c;
      return distance;
    }

  },
});






</script>
