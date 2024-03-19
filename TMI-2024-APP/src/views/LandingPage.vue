<template>
  <ion-page>
    <ion-header >
      <ion-toolbar>
        <ion-title class="header-title">Visita-Me</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="background-landing">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="start-button-container">
        <ion-button href="/location" size="large" class="start-button">Start</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>
