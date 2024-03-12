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
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 2 page" />
        <ion-card>
          <img alt="Silhouette of mountains" src="../../imgs/gps.jpeg" />
          <ion-card-header>
            <ion-card-title>Usar GPS</ion-card-title>
            <ion-card-subtitle>Introducir coordenadas automáticamente</ion-card-subtitle>
           </ion-card-header>

          <ion-card-content>
            Mediante esta funcionalidad, la aplicación capturará la ubicación de su dispositivo automáticamente
            <ion-button @click="geolocateIncident" id="open-modal1">Usar GPS</ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <img alt="Silhouette of mountains" src="../../imgs/coordenadas.jpeg" />
          <ion-card-header>
            <ion-card-title>Manualmente</ion-card-title>
            <ion-card-subtitle>Introducir coordenadas manualmente</ion-card-subtitle>
           </ion-card-header>

          <ion-card-content>
            Mediante esta funcionalidad, será el usuario quién de sus coordenadas
            <ion-button id="open-modal2">Introducir Manualmente</ion-button>
          </ion-card-content>
        </ion-card>

        <ion-modal trigger="open-modal1" :initial-breakpoint="1" :breakpoints="[0, 1]">
          <div class="block">GPS AUTOMATICA</div>
          <p>Su latitud es: {{ latitud }}</p>
          <p>Su longitud es: {{ longitud }}</p>
        </ion-modal>

        <ion-modal trigger="open-modal2" :initial-breakpoint="1" :breakpoints="[0, 1]">
          <div class="block">COORDENADAS MANUALES</div>
          <ion-item>
            <ion-input v-model="latitud" type="text" label="Latitud"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="longitud" type="text" label="Latitud"></ion-input>
          </ion-item>
          <p>Su latitud es: {{ latitud }}</p>
          <p>Su longitud es: {{ longitud }}</p>
        </ion-modal>

        
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonButton, IonCard, IonCardContent, 
  IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal,
  IonLabel, IonInput, IonItem} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { defineComponent, ref  } from 'vue';

let latitud =  ref<string | number | undefined>();
let longitud =  ref<string | number | undefined>();

function error() {
  alert("Sorry, no position available.");
}

const options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};

const geolocateIncident = async()=>{
  const positionIncident= await new Promise<any>((accept)=>{
    navigator.geolocation.getCurrentPosition(accept, error, options);
  });
  latitud.value= positionIncident.coords.latitude;
  longitud.value= positionIncident.coords.longitude;
};

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
</style>