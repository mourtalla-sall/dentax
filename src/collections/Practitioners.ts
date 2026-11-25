import type { CollectionConfig } from 'payload'

export const Practitioners: CollectionConfig = {
  slug: 'practitioners',
  labels: { singular: 'Praticien', plural: 'Praticiens' },
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media', required: true },
    { name: 'specialty', label: 'Spécialité', type: 'text', required: true },
    { name: 'rpps', label: 'N° RPPS', type: 'text' },
    { name: 'diplomas', label: 'Diplômes et parcours', type: 'textarea' },
    { name: 'scope', label: "Champs d'intervention", type: 'textarea' },
    { name: 'convention', label: 'Conventionnement', type: 'text', defaultValue: 'Prise en charge conventionnée secteur 1' },
    { name: 'order', label: 'Ordre', type: 'number', defaultValue: 1 },
  ],
}