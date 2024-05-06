<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="header-title">Lista de lugares a visitar</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-title>Lugares emblemáticos de {{ city }}</ion-title>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-list :inset="true" v-if="places.length > 0">
              <ion-item v-for="(place, index) in places" :key="index" class="ion-text-center">
                <ion-card :id="'card-' + index" class="ion-text-center">
                  <ion-card-title>{{ place.name }}</ion-card-title>
                  <ion-card-header>{{ place.vicinity }}</ion-card-header>
                  <ion-item>
                    <img :src=imgLinks[index] crossorigin/>
                  </ion-item>
                  <ion-button @click="takePicture(index)">Foto</ion-button>
                </ion-card>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-text-center">
            <ion-button @click="exportarLugares()">Finalizar recorrido</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonList, useIonRouter, IonButton, IonImg, IonPopover,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import axios from "axios"
import { API_KEY } from "../key"
import { Camera, CameraResultType } from '@capacitor/camera';
import { ciudad_export, latitud_export, longitud_export } from "./Tab2Page.vue";

export let places_export = ref<any[]>([]);
export default defineComponent({
  components: { IonPage, IonItem, IonButton },
  data() {
    return {
      api_key: API_KEY,
      lat: 40.43985248489788,
      lng: -3.7057588187122303,
      keyword: "Sitios+emblematicos+de",
      radius: "50000",
      city: "",
      numSites: 5,
      places: [],
      imgLinks: [],
      siteCoords: [],
      photoCoords: [],
      correctPhotos: [],
      route: useIonRouter(),
    };
  },
  mounted() {
    this.city = ciudad_export.value;
    const URL = "/api/maps/api/place/nearbysearch/json?location=" + latitud_export.value + "," + longitud_export.value + "&keyword=" + this.keyword + ciudad_export.value + "&radius=" + this.radius + "&key=" + API_KEY;
    axios.get(URL).then(response => {
      this.places = response.data.results.slice(0, this.numSites);
      for (let i = 0; i < this.places.length; i++) {
        this.siteCoords[i] = this.places[i].geometry.location;
        this.monumentPhoto(this.places[i].photos[0].photo_reference, i);
      }

      //console.log(this.imgLinks);
      //console.log(response.data.results);

    }).catch(error => {
      console.log(error.message);
    });

  },
  methods: {
    monumentPhoto(photo_ref: string, index: number) {
      const url = "/api/maps/api/place/photo?maxwidth=400&photo_reference=" + photo_ref + "&key=" + API_KEY;
      var xhr = new XMLHttpRequest();
      var vm = this;
      xhr.open('GET', url, true)
      xhr.onload = function () {
        vm.imgLinks[index] = xhr.responseURL.trim();
      };
      xhr.send(null);

    },
    async takePicture(id: number) {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      var imageUrl = image.webPath;
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
        if (this.haversine(this.siteCoords[id], this.photoCoords[id]) < 500) {
          this.correctPhotos[id] = true;
          let aux = "card-" + id;
          let el = document.getElementById(aux);
          el.disabled = true;
        }
        else {
          alert("La foto que has tomado está demasiado lejos del sitio. Prueba a hacer otra más cerca.")
        }
      }).catch(error => {
        console.log("Error al obtener la foto: " + error.message);
        alert("No se ha podido reconocer ninguna ubicación en esta foto. Prueba con otra")
      });
    },
    toRadians(degrees: number) {
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
    },
    async exportarLugares() {
      places_export.value = this.places;
      this.route.push('/end');
    }

  },
});




</script>
