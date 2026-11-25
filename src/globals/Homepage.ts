import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: "Page d'accueil",
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      label: 'Hero',
      type: 'group',
      fields: [
        { name: 'pill', label: 'Étiquette', type: 'text', defaultValue: 'Un sourire confiant commence ici' },
        { name: 'title', label: 'Titre', type: 'text', defaultValue: 'Créer de beaux sourires avec la touche personnelle' },
        { name: 'text', label: 'Sous-texte', type: 'textarea' },
        { name: 'image', label: 'Photo de fond', type: 'upload', relationTo: 'media' },
        { name: 'primaryCta', label: 'Bouton principal', type: 'text', defaultValue: 'Prendre rendez-vous' },
        { name: 'secondaryCta', label: 'Bouton secondaire', type: 'text', defaultValue: 'Consulter les soins' },
        { name: 'badge', label: 'Badge en bas de photo', type: 'text', defaultValue: 'Stérilisation certifiée' },
      ],
    },
    {
      name: 'commitments',
      label: 'Engagements cliniques',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Déontologie & engagements cliniques' },
        { name: 'title', type: 'text', defaultValue: "L'alliance de la rigueur scientifique et de la bientraitance médicale." },
        { name: 'intro', type: 'textarea' },
        { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media' },
        {
          name: 'cards',
          label: 'Cartes',
          type: 'array',
          maxRows: 2,
          fields: [
            { name: 'tag', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'text', type: 'textarea' },
            { name: 'checks', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
            { name: 'pills', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
          ],
        },
      ],
    },
    {
      name: 'treatments',
      label: 'Section Soins',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Des soins de haute précision fondés sur la biologie' },
        { name: 'intro', type: 'textarea' },
        { name: 'image', label: 'Photo', type: 'upload', relationTo: 'media' },
        { name: 'badge', label: 'Badge', type: 'text', defaultValue: 'Contrôle à 12 mois · Santé parodontale stable' },
      ],
    },
  ],
}