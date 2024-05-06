<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Proporciona tu ubicación</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">¿Dónde vamos?</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 2 page" />

      <ion-card class="distancia">
        <img src="../../imgs/gps.jpeg" class="imagen-fondo ">
        <!--"https://www.flaticon.es/iconos-gratis/gps" - DinosoftLabs - Flaticon-->
        <img src="../../imgs/mapa.png" class="mapa">
        <ion-card-header class="boton-centrado">
          <ion-card-title>
            <ion-button @click="geolocateIncident(),setOpenModal1(true)">Usar Ubicación Actual</ion-button>
          </ion-card-title>
        </ion-card-header>
      </ion-card>

      <ion-card class="distancia">
        <img src="../../imgs/coordenadas.jpeg" class="imagen-fondo ">
        <!--"https://www.flaticon.es/iconos-gratis/signo-de-interrogacion" - Flaticon-->
        <!--"https://www.flaticon.es/iconos-gratis/gps" - DinosoftLabs - Flaticon-->
        <img src="../../imgs/mapa.png" class="mapa2">
        <img src="../../imgs/interrogacion.png" class="interrogacion">
        <ion-card-header class="boton-centrado">
          <ion-card-title>
            <ion-button @click="setOpenModal2(true)">Introducir Manualmente</ion-button>
          </ion-card-title>
        </ion-card-header>
      </ion-card>

      <ion-modal :is-open="isOpenModal1" class="modal">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="" @click="setOpenModal1(false)"></ion-back-button>
          </ion-buttons>
          <ion-label>Ubicación Automática
          </ion-label>
        </ion-toolbar>
        <ion-grid size="auto">
          <ion-row >
            <ion-col class="ion-text-center">
              <ion-label>Estás en:</ion-label>
            </ion-col>
        
          </ion-row>
          <ion-row>
            <ion-col></ion-col>
            <ion-col class="ion-text-center"><ion-title>{{ this.ubicacion }}</ion-title></ion-col>
            <ion-col></ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="ion-text-justify">
              <ion-label>Si no estás en este sitio, prueba a volver atrás e introducir manualmente tu
                ciudad</ion-label></ion-col>
          </ion-row>
        <ion-row> 
          <ion-col></ion-col>
            <ion-col>
          <ion-button @click="setOpenModal1(false),navigateToRoute()">Continuar</ion-button></ion-col>
            <ion-col></ion-col>
        </ion-row>
        </ion-grid>

        
      </ion-modal>
     
      <ion-modal  :is-open="isOpenModal2" class="modal" >
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="" @click="setOpenModal2(false)"></ion-back-button>
          </ion-buttons>
          <ion-label>Introduce el nombre de la ciudad
          </ion-label>
        </ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-col size="7" class="ion-text-center">
              <ion-label>Ahora mismo estás en: </ion-label>
            </ion-col>
            <ion-col size=5 class="ion-text-left">
              <ion-label>{{ ciudad }}</ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
            <ion-searchbar @ionInput="autocomplete($event)"></ion-searchbar>
        <ion-list :inset="true" v-if="predictionsList.length > 0">
          <ion-item v-for="(pred, index) in predictionsList" :key="pred.id">
            <ion-label @click="selectCityCoord(pred)">{{ pred.description }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-col>
          </ion-row>
          <ion-row> 
          <ion-col></ion-col>
            <ion-col>
          <ion-button @click="setOpenModal2(false),navigateToRoute()">Continuar</ion-button></ion-col>
            <ion-col></ion-col>
        </ion-row>
        </ion-grid>
        
        <!--<p>Ciudad: {{ ciudad }}</p>
        <ion-button @click="exportarCiudad">ciudad exportable</ion-button>-->
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal,
  IonLabel, IonInput, IonItem, IonSearchbar, IonList,
  IonAlert, IonGrid, IonRow, IonCol, useIonRouter, IonButtons, IonBackButton
} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { defineComponent, ref } from 'vue';
import { API_KEY } from "../key"
import axios from "axios"

export let latitud_export = ref<string | number | undefined>();
export let longitud_export = ref<string | number | undefined>();
export let ciudad_export = ref<string | undefined>();

export default defineComponent({
  components: {
    IonInput, IonItem, IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent, IonButton, IonModal, IonCard,
    IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent,
    IonSearchbar, IonList, IonLabel, IonAlert, IonBackButton, IonButtons
  },
  data() {
    return {
      latitud: ref<string | number | undefined>(),
      longitud: ref<string | number | undefined>(),
      ciudad: ref<string | undefined>(),
      options: {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      },
      predictionsList: [],
      showAlertComponent: false,
      nameAlert: "",
      ubicacion: "...",
      route: useIonRouter(),
      isOpenModal1: ref(false),
      isOpenModal2: ref(false),
      ciudadLabel: "",
    };
  },
  methods: {
    error() {
      alert("Sorry, no position available.");
    },

    async geolocateIncident() {
      const positionIncident = await new Promise<any>((accept) => {
        navigator.geolocation.getCurrentPosition(accept, this.error, this.options);
      });
      this.latitud = positionIncident.coords.latitude;
      latitud_export.value = this.latitud;
      this.longitud = positionIncident.coords.longitude;
      longitud_export.value = this.longitud;
      const url = "/api/maps/api/geocode/json?latlng=" + this.latitud + "," + this.longitud + "&key=" + API_KEY;
      axios.get(url).then(response => {
        this.ubicacion = response.data.results[0].address_components[2].long_name
        ciudad_export.value=this.ubicacion;
      }).catch(error => {
        console.log(error.message);
        alert("Se ha producido un error, inténtalo de nuevo")
      });
    },

    /*
    exportarCiudad(){
      ciudad_export.value= this.ciudad;
    },
    */
    autocomplete(event: string) {
      const url = "/api/maps/api/place/autocomplete/json?input=" + event?.target.value.toLowerCase() + "&language=es_ES&types=%28cities%29&key=" + API_KEY;
      axios.get(url).then(response => {
        this.predictionsList = response.data.predictions;
      }).catch(error => {
        console.log(error.message);
      });
    },
    selectCityCoord(pred: any) {
      this.ciudad = pred.structured_formatting.main_text;
      const url = "/api/maps/api/place/details/json?place_id=" + pred.place_id + "&key=" + API_KEY;
      axios.get(url).then(response => {
        this.latitud = response.data.result.geometry.location.lat;
        this.longitud = response.data.result.geometry.location.lng;

        latitud_export.value = this.latitud;
        longitud_export.value = this.longitud;

        console.log(response.data.result.name);
        this.nameAlert = response.data.result.name;
        ciudad_export.value = this.nameAlert;

        this.showAlertComponent = true;
      }).catch(error => {
        console.log(error.message);
      });
      this.latitud;
    },
    navigateToRoute() {
      this.route.navigate('/siteList')
      //this.route.push('/siteList');
    },
    setOpenModal1(open: boolean) {
      this.isOpenModal1 = open;
    },
    setOpenModal2(open: boolean) {
      this.isOpenModal2 = open;
    }
  }
})
</script>

<style>
.modal {
  --background: black;
  width: auto;
}
</style>