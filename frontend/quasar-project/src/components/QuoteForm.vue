<template>
  <div class="quote-form">
    <div class="text-h6 q-mb-md">Richiedi un preventivo</div>
    
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.firstName"
            label="Nome *"
            filled
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Il nome è obbligatorio']"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.lastName"
            label="Cognome *"
            filled
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Il cognome è obbligatorio']"
          />
        </div>
      </div>

      <div class="row q-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.email"
            label="Email *"
            type="email"
            filled
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'L\'email è obbligatoria',
              val => isValidEmail(val) || 'Inserisci un\'email valida'
            ]"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.phone"
            label="Telefono"
            filled
            mask="### ### ####"
          />
        </div>
      </div>

      <div class="row q-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.company"
            label="Azienda"
            filled
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="form.vatNumber"
            label="Partita IVA"
            filled
          />
        </div>
      </div>

      <q-input
        v-model="form.address"
        label="Indirizzo"
        filled
      />

      <q-input
        v-model="form.notes"
        label="Note aggiuntive"
        filled
        type="textarea"
        rows="4"
        placeholder="Inserisci eventuali note o richieste specifiche..."
      />

      <q-checkbox
        v-model="form.acceptTerms"
        label="Accetto i termini e le condizioni del servizio *"
        :rules="[(val: boolean) => val || 'Devi accettare i termini e le condizioni']"
      />

      <q-checkbox
        v-model="form.acceptPrivacy"
        label="Accetto l'informativa sulla privacy *"
        :rules="[(val: boolean) => val || 'Devi accettare l\'informativa sulla privacy']"
      />

      <div class="row q-gutter-sm q-mt-md">
        <q-btn 
          label="Invia richiesta" 
          type="submit" 
          color="primary"
          :loading="loading"
          :disable="!canSubmit"
        />
        <q-btn 
          label="Reset" 
          type="reset" 
          color="primary" 
          flat 
        />
      </div>
    </q-form>

    <!-- Success/Error messages -->
    <q-banner v-if="submitMessage" :class="submitSuccess ? 'bg-positive' : 'bg-negative'" class="text-white q-mt-md">
      <template v-slot:avatar>
        <q-icon :name="submitSuccess ? 'check_circle' : 'error'" />
      </template>
      {{ submitMessage }}
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'

// Form interface
interface QuoteForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  vatNumber: string
  address: string
  notes: string
  acceptTerms: boolean
  acceptPrivacy: boolean
}

const cartStore = useCartStore()

// Form state
const form = ref<QuoteForm>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  vatNumber: '',
  address: '',
  notes: '',
  acceptTerms: false,
  acceptPrivacy: false
})

// Loading and message state
const loading = ref(false)
const submitMessage = ref('')
const submitSuccess = ref(false)

// Computed properties
const canSubmit = computed(() => {
  return form.value.firstName && 
         form.value.lastName && 
         form.value.email && 
         isValidEmail(form.value.email) && 
         form.value.acceptTerms && 
         form.value.acceptPrivacy &&
         cartStore.products.length > 0
})

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

// Form handlers
const onSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  submitMessage.value = ''

  try {
    // Prepare quote data
    const quoteData = {
      customer: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        company: form.value.company,
        vatNumber: form.value.vatNumber,
        address: form.value.address
      },
      products: cartStore.products.map(product => ({
        _id: product._id,
        name: product.name,
        code: product.code,
        brand: product.brand,
        category: product.category,
        quantity: product.quantity,
        price: product.price
      })),
      notes: form.value.notes,
      createdAt: new Date().toISOString()
    }

    // Here you would typically send the data to your API
    console.log('Quote request:', quoteData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Success
    submitSuccess.value = true
    submitMessage.value = 'La tua richiesta di preventivo è stata inviata con successo! Ti contatteremo presto.'
    
    // Clear cart after successful submission
    cartStore.clearCart()
    
  } catch (error) {
    submitSuccess.value = false
    submitMessage.value = 'Si è verificato un errore durante l\'invio della richiesta. Riprova più tardi.'
    console.error('Quote submission error:', error)
  } finally {
    loading.value = false
    
    // Clear message after 5 seconds
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  }
}

const onReset = () => {
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    vatNumber: '',
    address: '',
    notes: '',
    acceptTerms: false,
    acceptPrivacy: false
  }
  submitMessage.value = ''
}
</script>

<style scoped>
.quote-form {
  max-width: 800px;
  margin: 0 auto;
}

.q-banner {
  border-radius: 8px;
}
</style>