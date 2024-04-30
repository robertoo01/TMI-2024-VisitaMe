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

            <iframe class="video_recorrido" src="https://www.youtube.com/watch?v=JC6OP19yo0I" frameborder="0" allowfullscreen></iframe>
            <img class="img_recorrido" alt="Silhouette of mountains" src="https://ionicframework.com/docs/img/demos/card-media.png" />
            
            <ion-button @click="navigateToRoute" class="button_container" shape="round" size="large">Nueva Ruta</ion-button>
        </ion-card>

      </ion-content>
    </ion-page>
  </template>
  
<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
     IonCardSubtitle, IonCardContent, IonButton, 
useIonRouter} from '@ionic/vue';
  
  import { ciudad_export, latitud_export, longitud_export } from "./Tab2Page.vue";

  import { useRouter } from 'vue-router';

  const route = useIonRouter();

  const volver = () => {
    console.log('Empezar de nuevo');
    // Aquí puedes realizar cualquier acción adicional
  };

  const navigateToRoute = () => {
      // Utiliza el método push del enrutador para navegar a la ruta deseada
      route.push('/landing');
      route.push('/');
      console.log(route);
      console.log(route);
      
    };
  

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

</style>