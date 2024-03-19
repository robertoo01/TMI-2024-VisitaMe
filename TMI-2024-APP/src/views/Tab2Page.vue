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
      latitud_export= ref(this.latitud);
      this.longitud= positionIncident.coords.longitude;
      longitud_export= ref(this.longitud);
    },

    exportarCiudad(){
      ciudad_export= ref(this.ciudad);
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
</style>