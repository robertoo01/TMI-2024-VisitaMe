<template>
  <ion-page>
    <ion-header >
      <ion-toolbar>
        <ion-title class="header-title">Visita-Me</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="background-landing">
      <div class="start-button-container">
        <ion-button href="/location" size="large" class="start-button">Empezar</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
</script>
