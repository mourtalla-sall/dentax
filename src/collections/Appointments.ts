import type { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: { singular: 'Rendez-vous', plural: 'Rendez-vous' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['date', 'time', 'fullName', 'phone', 'status'],
  },
  defaultSort: '-date',
  // Données personnelles : lecture et modification réservées au personnel connecté.
  // La création publique passe uniquement par la route /api/appointments.
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
   hooks: {
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (!data) return data
        const status = data.status ?? originalDoc?.status
        const date = data.date ?? originalDoc?.date
        const time = data.time ?? originalDoc?.time

        // Un rendez-vous annulé libère le créneau ; sinon la clé unique le verrouille.
        if (status === 'cancelled') {
          data.slotKey = null
        } else if (date && time) {
          data.slotKey = `${date}T${time}`
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'fullName', label: 'Nom et prénom', type: 'text', required: true },
    { name: 'phone', label: 'Téléphone', type: 'text', required: true },
    { name: 'email', label: 'E-mail (facultatif)', type: 'email' },
    {
      name: 'reason',
      label: 'Type de consultation',
      type: 'select',
      required: true,
      options: [
        { label: 'Première consultation', value: 'first' },
        { label: 'Contrôle', value: 'checkup' },
        { label: 'Urgence', value: 'urgent' },
        { label: 'Autre', value: 'other' },
      ],
    },
    { name: 'date', label: 'Date (AAAA-MM-JJ)', type: 'text', required: true },
    { name: 'time', label: 'Heure (HH:MM)', type: 'text', required: true },
    {
      name: 'slotKey',
      type: 'text',
      unique: true,
      index: true,
      admin: { hidden: true, readOnly: true },
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      defaultValue: 'requested',
      options: [
        { label: 'Demandé', value: 'requested' },
        { label: 'Confirmé', value: 'confirmed' },
        { label: 'Annulé', value: 'cancelled' },
      ],
    },
    { name: 'consent', label: 'Consentement RGPD donné', type: 'checkbox', required: true },
    { name: 'internalNote', label: 'Note interne', type: 'textarea' },
  ],
}