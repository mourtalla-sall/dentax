import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Soin', plural: 'Soins' },
  admin: { useAsTitle: 'title', defaultColumns: ['order', 'title'] },
  defaultSort: 'order',
  access: { read: () => true },
  fields: [
    { name: 'order', label: 'Ordre', type: 'number', required: true, defaultValue: 1 },
    { name: 'title', label: 'Titre', type: 'text', required: true },
    { name: 'summary', label: 'Description courte', type: 'textarea', required: true },
    { name: 'detail', label: 'Détail (affiché au clic)', type: 'textarea' },
    { name: 'icon', label: 'Icône (SVG)', type: 'upload', relationTo: 'media' },
  ],
}