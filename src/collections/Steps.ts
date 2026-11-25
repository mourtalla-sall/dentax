import type { CollectionConfig } from 'payload'

export const Steps: CollectionConfig = {
  slug: 'steps',
  labels: { singular: 'Étape', plural: 'Étapes du parcours' },
  admin: { useAsTitle: 'title', defaultColumns: ['number', 'title'] },
  defaultSort: 'number',
  access: { read: () => true },
  fields: [
    { name: 'number', label: "N° d'étape", type: 'number', required: true },
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'text', label: 'Texte', type: 'textarea', required: true },
    { name: 'duration', label: 'Durée ou précision', type: 'text' },
  ],
}