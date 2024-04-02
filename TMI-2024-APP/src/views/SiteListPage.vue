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
    <ion-list :inset="true">
      <ion-label>Lista de lugares emblemáticos a visitar</ion-label>
      <ion-item>
        <ion-label>Palacio Real de Madrid</ion-label>
        <ion-button @click="push">></ion-button>
      </ion-item>
      <ion-item>
        <ion-label>Casa de Campo</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Plaza de España</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Templo de Debod</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Plaza Mayor</ion-label>
      </ion-item>
    </ion-list>
  </ion-item>
  <!--div id="mapContainer" style="height: 400px;"></div-->
      <!--ul>
        <li v-for="monument in monuments" :key="monument.place_id">
          {{ monument.name }}
        </li>
      </ul-->
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, useIonRouter, IonButton } from '@ionic/vue';
import { Storage } from '@ionic/storage'; 
import { defineComponent } from 'vue';
//import { location } from './Tab2Page.vue';

export default defineComponent({
  components: { IonPage },
  setup() {
    const router = useIonRouter();
    const push = () => {
      router.push('/locationDetails');
    };
    return { push };
  }
});
</script>
