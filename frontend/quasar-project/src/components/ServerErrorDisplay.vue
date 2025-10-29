<template>
  <div class="error-container">
    <div class="error-content">
      <!-- Icona di errore server -->
      <div class="error-icon">
        <q-icon 
          name="cloud_off" 
          size="120px" 
          color="grey-5"
        />
      </div>
      
      <!-- Messaggio principale -->
      <div class="error-title">
        Servizio temporaneamente non disponibile
      </div>
      
      <!-- Messaggio di dettaglio -->
      <div class="error-message">
        <div v-if="error?.type === 'network'">
          Non è possibile connettersi al server. Verifica la tua connessione internet.
        </div>
        <div v-else-if="error?.type === 'server'">
          Il server sta riscontrando dei problemi tecnici. Riprova tra qualche minuto.
        </div>
        <div v-else>
          Si è verificato un errore imprevisto. Riprova più tardi.
        </div>
      </div>
      
      <!-- Dettagli tecnici (solo in development) -->
      <div v-if="showTechnicalDetails" class="error-details">
        <q-expansion-item
          icon="bug_report"
          label="Dettagli tecnici"
          header-class="text-grey-7"
        >
          <div class="q-pa-md bg-grey-1">
            <div><strong>Tipo errore:</strong> {{ error?.type }}</div>
            <div v-if="error?.statusCode">
              <strong>Codice stato:</strong> {{ error.statusCode }}
            </div>
            <div><strong>Messaggio:</strong> {{ error?.message }}</div>
          </div>
        </q-expansion-item>
      </div>
      
      <!-- Azioni -->
      <div class="error-actions">
        <q-btn
          color="primary"
          icon="refresh"
          label="Riprova"
          @click="$emit('retry')"
          :loading="loading"
        />
        <q-btn
          flat
          color="primary"
          icon="home"
          label="Torna alla home"
          @click="$emit('goHome')"
        />
        
        <!-- Development only: simulate different errors -->
        <div v-if="showTechnicalDetails" class="q-mt-md">
          <q-separator class="q-my-md" />
          <div class="text-caption text-grey-6 q-mb-sm">Test errori (solo sviluppo):</div>
          <div class="row q-gutter-sm">
            <q-btn
              size="sm"
              outline
              color="orange"
              label="Simula 500"
              @click="$emit('simulateError', 'server')"
            />
            <q-btn
              size="sm"
              outline
              color="red"
              label="Simula Network"
              @click="$emit('simulateError', 'network')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ErrorInfo } from '../stores/products'

interface Props {
  error: ErrorInfo | null
  loading?: boolean
  showTechnicalDetails?: boolean
}

defineProps<Props>()

defineEmits<{
  retry: []
  goHome: []
  simulateError: [type: 'server' | 'network']
}>()
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-icon {
  margin-bottom: 2rem;
  opacity: 0.7;
}

.error-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #424242;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1rem;
  color: #757575;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.error-details {
  margin-bottom: 2rem;
  text-align: left;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .error-container {
    padding: 1rem;
  }
  
  .error-title {
    font-size: 1.25rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .q-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>