export interface IKStats {
  ataque: number
  defensa: number
  velocidad: number
}

export interface IKMember {
  id: string
  artisticName: string
  photo1: string
  photo2: string
  stats: IKStats
}

export interface IKTeam {
  id: string
  name: string
  color: string
  colorDark: string
  cssVar: string
  teamPhoto: string
  members: IKMember[]
}

const BASE = '/images/impronakuy-2026'

export const IK_TEAMS: IKTeam[] = [
  {
    id: 'culiprincess',
    name: 'Las Culiprincess',
    color: '#e879f9',
    colorDark: '#a21caf',
    cssVar: '--ik-culiprincess',
    teamPhoto: `${BASE}/Las Culiprincess/Las Culiprincess.webp`,
    members: [
      {
        id: 'katherine',
        artisticName: 'Katherine II de la via expresa',
        photo1: `${BASE}/Las Culiprincess/Katherine II de la via expresa - 1.webp`,
        photo2: `${BASE}/Las Culiprincess/Katherine II de la via expresa - 2.webp`,
        stats: { ataque: 4, defensa: 3, velocidad: 3 },
      },
      {
        id: 'jennifer',
        artisticName: 'Jennifer I de Huancaro',
        photo1: `${BASE}/Las Culiprincess/Jennifer I de Huancaro - 1.webp`,
        photo2: `${BASE}/Las Culiprincess/Jennifer I de Huancaro - 2.webp`,
        stats: { ataque: 3, defensa: 4, velocidad: 3 },
      },
      {
        id: 'chantal',
        artisticName: 'Chantal III de Coripata',
        photo1: `${BASE}/Las Culiprincess/Chantal III de Coripata - 1.webp`,
        photo2: `${BASE}/Las Culiprincess/Chantal III de Coripata - 2.webp`,
        stats: { ataque: 5, defensa: 2, velocidad: 3 },
      },
    ],
  },
  {
    id: 'tetris',
    name: 'Tetris',
    color: '#4ade80',
    colorDark: '#15803d',
    cssVar: '--ik-tetris',
    teamPhoto: `${BASE}/Tetris/Tetris.webp`,
    members: [
      {
        id: 'eggman',
        artisticName: 'Dr. Eggman',
        photo1: `${BASE}/Tetris/Dr. Eggman - 1.webp`,
        photo2: `${BASE}/Tetris/Dr. Eggman - 2.webp`,
        stats: { ataque: 4, defensa: 4, velocidad: 2 },
      },
      {
        id: 'bombita',
        artisticName: 'Bombita Dinamita',
        photo1: `${BASE}/Tetris/Bombita Dinamita - 1.webp`,
        photo2: `${BASE}/Tetris/Bombita Dinamita - 2.webp`,
        stats: { ataque: 5, defensa: 2, velocidad: 4 },
      },
      {
        id: 'noqashi',
        artisticName: 'Noqa-shi',
        photo1: `${BASE}/Tetris/Noqa-shi - 1.webp`,
        photo2: `${BASE}/Tetris/Noqa-shi - 2.webp`,
        stats: { ataque: 3, defensa: 3, velocidad: 5 },
      },
    ],
  },
  {
    id: 'cercano-oeste',
    name: 'Cercano Oeste',
    color: '#fb923c',
    colorDark: '#c2410c',
    cssVar: '--ik-cercano',
    teamPhoto: `${BASE}/Cercano Oeste/Cercano Oeste.webp`,
    members: [
      {
        id: 'sucio-moe',
        artisticName: 'Sucio Moe',
        photo1: `${BASE}/Cercano Oeste/Sucio Moe - 1.webp`,
        photo2: `${BASE}/Cercano Oeste/Sucio Moe - 2.webp`,
        stats: { ataque: 4, defensa: 3, velocidad: 3 },
      },
      {
        id: 'amy',
        artisticName: 'Amy White Face',
        photo1: `${BASE}/Cercano Oeste/Amy White Face - 1.webp`,
        photo2: `${BASE}/Cercano Oeste/Amy White Face - 2.webp`,
        stats: { ataque: 3, defensa: 3, velocidad: 4 },
      },
      {
        id: 'sheriff',
        artisticName: 'Sheriff Calamity Rita Revolver',
        photo1: `${BASE}/Cercano Oeste/Sheriff Calamity - 1.webp`,
        photo2: `${BASE}/Cercano Oeste/Sheriff Calamity - 2.webp`,
        stats: { ataque: 5, defensa: 4, velocidad: 3 },
      },
    ],
  },
  {
    id: 'mal-organizado',
    name: 'El Mal Organizado',
    color: '#f87171',
    colorDark: '#b91c1c',
    cssVar: '--ik-mal',
    teamPhoto: `${BASE}/El mal Organizado/El Mal Organizado.webp`,
    members: [
      {
        id: 'emperatriz',
        artisticName: 'Emperatriz Desbarajada',
        photo1: `${BASE}/El mal Organizado/Emperatriz Desbarajada - 1.webp`,
        photo2: `${BASE}/El mal Organizado/Emperatriz Desbarajada - 2.webp`,
        stats: { ataque: 4, defensa: 5, velocidad: 2 },
      },
      {
        id: 'hadencio',
        artisticName: 'Hadencio el torpencio',
        photo1: `${BASE}/El mal Organizado/Hadencio el torpencio - 1.webp`,
        photo2: `${BASE}/El mal Organizado/Hadencio el torpencio - 2.webp`,
        stats: { ataque: 4, defensa: 3, velocidad: 3 },
      },
      {
        id: 'cruelifica',
        artisticName: 'Cruelifica',
        photo1: `${BASE}/El mal Organizado/Cruelifica - 1.webp`,
        photo2: `${BASE}/El mal Organizado/Cruelifica - 2.webp`,
        stats: { ataque: 5, defensa: 3, velocidad: 3 },
      },
    ],
  },
  {
    id: 'fachonistas',
    name: 'Los Fachonistas',
    color: '#fbbf24',
    colorDark: '#b45309',
    cssVar: '--ik-fachonistas',
    teamPhoto: `${BASE}/Los Fachonistas/Los Fachonistas.webp`,
    members: [
      {
        id: 'raffita',
        artisticName: 'Raffita Izquierdo de Hierro e Inversiones',
        photo1: `${BASE}/Los Fachonistas/Raffita Izquierdo de Hierro e Inversiones - 1.webp`,
        photo2: `${BASE}/Los Fachonistas/Raffita Izquierdo de Hierro e Inversiones - 2.webp`,
        stats: { ataque: 4, defensa: 5, velocidad: 2 },
      },
      {
        id: 'calletana',
        artisticName: 'Calletana de las Casas',
        photo1: `${BASE}/Los Fachonistas/Calletana de las Casas - 1.webp`,
        photo2: `${BASE}/Los Fachonistas/Calletana de las Casas - 2.webp`,
        stats: { ataque: 3, defensa: 4, velocidad: 4 },
      },
      {
        id: 'facundo',
        artisticName: 'Facundo Salvador de las Lomas',
        photo1: `${BASE}/Los Fachonistas/Facundo Salvador de las Lomas - 1.webp`,
        photo2: `${BASE}/Los Fachonistas/Facundo Salvador de las Lomas - 2.webp`,
        stats: { ataque: 5, defensa: 2, velocidad: 4 },
      },
    ],
  },
]

export const getIKTeamById = (id: string): IKTeam | undefined =>
  IK_TEAMS.find((t) => t.id === id)
