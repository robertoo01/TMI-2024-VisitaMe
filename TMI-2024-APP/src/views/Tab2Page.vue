<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
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
            <ion-button @click="geolocateIncident" id="open-modal1">Usar Ubicación Actual</ion-button>
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
            <ion-button id="open-modal2">Introducir Manualmente</ion-button>
          </ion-card-title>
        </ion-card-header>
      </ion-card>

      <ion-modal trigger="open-modal1" :initial-breakpoint="1" :breakpoints="[0, 1]">
        <div class="block">GPS AUTOMATICA</div>
        <p>Su latitud es: {{ latitud }}</p>
        <p>Su longitud es: {{ longitud }}</p>
      </ion-modal>

      <ion-modal trigger="open-modal2" :initial-breakpoint="1" :breakpoints="[0, 1]">
        <div class="block">INTRODUZCA SU CIUDAD</div>
        <ion-item>
          <ion-input v-model="ciudad" type="text" label="ciudad"></ion-input>
        </ion-item>
        <p>Ciudad: {{ ciudad }}</p>
        <ion-button @click="exportarCiudad">ciudad exportable</ion-button>
      </ion-modal> 
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonButton, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal,
  IonLabel, IonInput, IonItem} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { defineComponent, ref  } from 'vue';

export let latitud_export= ref<string | number | undefined>();
export let longitud_export= ref<string | number | undefined>();
export let ciudad_export= ref<string | undefined>();

export default defineComponent({
  components: {IonInput, IonItem, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent},
  data(){
    return{
      latitud: ref<string | number | undefined>(),
      longitud: ref<string | number | undefined>(),
      ciudad: ref<string | undefined>(),
      options: {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      }
    };
  },
  methods:{
    error() {
      alert("Sorry, no position available.");
    },

    async geolocateIncident() {
      const positionIncident= await new Promise<any>((accept)=>{
        navigator.geolocation.getCurrentPosition(accept, this.error, this.options);
      });
      this.latitud= positionIncident.coords.latitude;
      latitud_export.value= this.latitud;
      this.longitud= positionIncident.coords.longitude;
      longitud_export.value= this.longitud;
    },

    exportarCiudad(){
      ciudad_export.value= this.ciudad;
    }
  }
})

</script>

<style>
  .block {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ion-modal {
    --height: auto;
  }

  .distancia{
    margin-top: 20%;
    margin-bottom: 20%;
  }

  .interrogacion{
    position: absolute;
    top: 20%;
    left: 60%;
    width: 10%;
    height: 30%;
    z-index: 1;
  }
  .mapa{
    position: absolute;
    top: 20%;
    left: 20%;
    width: 10%;
    height: 30%;
    z-index: 1;
    transform: rotate(-10deg);
  }
  .mapa2{
    position: absolute;
    top: 20%;
    right: 20%;
    width: 10%;
    height: 30%;
    z-index: 1;
    transform: rotate(10deg);
  }

  .boton-centrado {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .imagen-fondo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    opacity: 0.3;
  }
</style>