import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du cabinet',
  access: { read: () => true },
  fields: [
    { name: 'clinicName', label: 'Nom du cabinet', type: 'text', defaultValue: 'Dentax' },
    { name: 'tagline', type: 'text', defaultValue: 'Cabinet dentaire' },
    { name: 'phone', label: 'Téléphone', type: 'text' },
    { name: 'address', label: 'Adresse', type: 'textarea' },
    { name: 'accessibility', label: 'Accessibilité', type: 'text', defaultValue: 'Établissement conforme PMR' },
    { name: 'orderNumber', label: "N° d'ordre / conseil départemental", type: 'text' },
    {
      name: 'hours',
      label: 'Horaires',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Lundi', value: '1' }, { label: 'Mardi', value: '2' },
            { label: 'Mercredi', value: '3' }, { label: 'Jeudi', value: '4' },
            { label: 'Vendredi', value: '5' }, { label: 'Samedi', value: '6' },
            { label: 'Dimanche', value: '0' },
          ],
        },
        { name: 'open', label: 'Ouverture (HH:MM)', type: 'text', required: true },
        { name: 'close', label: 'Fermeture (HH:MM)', type: 'text', required: true },
      ],
    },
    { name: 'breakStart', label: 'Début de pause', type: 'text', defaultValue: '12:30' },
    { name: 'breakEnd', label: 'Fin de pause', type: 'text', defaultValue: '14:00' },
    { name: 'slotMinutes', label: "Durée d'un créneau (minutes)", type: 'number', defaultValue: 30 },
  ],
}