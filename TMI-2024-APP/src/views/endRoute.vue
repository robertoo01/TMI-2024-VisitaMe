<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Tab 3</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-card>
            <ion-card-header>
                <ion-card-title>Tu recorrido</ion-card-title>
            </ion-card-header>

            <div style="display: flex; justify-content: center;">
              <capacitor-google-map ref="mapRef" style="width: 70%; height: 30vh"></capacitor-google-map>
            </div>

            <ion-button @click="ver"></ion-button>

            <ion-button @click="navigateToRoute" class="button_container" shape="round" size="large">Nueva Ruta</ion-button>
        </ion-card>

      </ion-content>
    </ion-page>
  </template>
  
<script setup lang="ts">

  import{ IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
          IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
          IonCardContent, IonButton, useIonRouter} from '@ionic/vue';
  
  import { ciudad_export, latitud_export, longitud_export } from "./Tab2Page.vue";

  import { useRouter } from 'vue-router';

  import { onMounted, nextTick, onUnmounted } from "vue";
  import { GoogleMap } from "@capacitor/google-maps";

  import { Ref, ref } from 'vue';

  const route = useIonRouter();

  import { API_KEY } from "../key";

  import { places_export } from './SiteListPage.vue';


  const ver=()=>{
    console.log(places_export.value);
  }

  const volver = () => {
    console.log('Empezar de nuevo');
    // Aquí puedes realizar cualquier acción adicional
  };

  const navigateToRoute = () => {
    // Utiliza el método push del enrutador para navegar a la ruta deseada
    route.push('/landing');
      
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
    if (mapRef.value && typeof latitud_export.value === 'number' && typeof longitud_export.value === 'number'){
      newMap = await GoogleMap.create({
        id: "my-cool-map",
        element: mapRef.value,
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
  async function addPolyLine(){
    const lines=[
      {
        path:[
          { 
            lat: places_export.value[0].geometry.location.lat, 
            lng: places_export.value[0].geometry.location.lng
          },
          {
            lat: places_export.value[1].geometry.location.lat, 
            lng:places_export.value[1].geometry.location.lng
          },
          {
            lat: places_export.value[2].geometry.location.lat, 
            lng:places_export.value[2].geometry.location.lng
          },
          {
            lat: places_export.value[3].geometry.location.lat, 
            lng:places_export.value[3].geometry.location.lng
          },
          {
            lat: places_export.value[4].geometry.location.lat, 
            lng:places_export.value[4].geometry.location.lng
          }
        ],
      },
    ];
    
    await newMap.addPolylines(lines);
  }
  
</script>

<style>
.img_recorrido {
    display: block;
    margin: 0 auto;
    width: 60%;
    margin-top: 10%;
    margin-bottom: 10%;
}

.video_recorrido{
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
    height: 10vh; /* Ajusta la altura según tus necesidades */
}

capacitor-google-map {
  display: inline-block;
  width: 275px;
  height: 400px;
}

</style>