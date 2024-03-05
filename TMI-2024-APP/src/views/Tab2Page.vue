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
            <ion-button id="open-modal1">Usar GPS</ion-button>
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
        </ion-modal>

        <ion-modal trigger="open-modal2" :initial-breakpoint="1" :breakpoints="[0, 1]">
          <div class="block">COORDENADAS MANUALES</div>
        </ion-modal>

        
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, 
        IonContent, IonButton, IonCard, IonCardContent, 
        IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal} from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';


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