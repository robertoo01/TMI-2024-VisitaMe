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
        <ion-list :inset="true" v-if="places.length == 5">
          <ion-label>Lista de lugares emblemáticos a visitar</ion-label>
          <ion-item v-for="place in places" :key="place.id">
              <ion-label>{{ place.name }}</ion-label>
              <ion-img :src="'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=' + place.photos[0].photo_reference + '&key=AIzaSyAiiWwBeiWGDdBOFCJ480LUHaBju8aneWU'"></ion-img>
          </ion-item>
        </ion-list>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, useIonRouter, IonButton, IonImg } from '@ionic/vue';
import { defineComponent } from 'vue';
//import { location } from './Tab2Page.vue';
import axios from "axios"


export default defineComponent({
  components: { IonPage },
  data() {
    return {
      lat: 40.4380981,
      lng: -3.8446862,
      keyword: "Sitios+emblematicos+de+Madrid",
      radius: "50000",
      places: [],
      imgLinks: [],
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
    const URL = "/api/maps/api/place/nearbysearch/json?location="+this.lat+","+this.lng+"&keyword="+this.keyword+"&radius="+this.radius+"&key=AIzaSyAiiWwBeiWGDdBOFCJ480LUHaBju8aneWU";
    axios.get(URL).then(response => {
      this.places = response.data.results.slice(0,5);
      console.log(response.data.results)
    }).catch(error => {
      console.log(error.message);
    });

  },
  methods: {
    monumentPhoto(photo_ref:string){
      const url = "/api/maps/api/place/photo?maxwidth=400&photo_reference=" + photo_ref + "&key=AIzaSyAiiWwBeiWGDdBOFCJ480LUHaBju8aneWU";
      axios.get(url).then(response => {
        return response;
      }).catch(error => {
      console.log("Error al obtener la foto: " + error.message);
    });
    }
  },
});
</script>
