// @ts-nocheck
export const ZONES = [
  {
    id: 'forest',
    name: 'Forest Zone',
    grade: 1,
    color: '#22c55e',
    emoji: '🌲',
    bg: 'from-green-900 via-green-800 to-emerald-900',
    description: 'A peaceful beginner area — build confidence with sight words, short stories, and simple sentence writing.',
    bosses: [
      { id: 'mushroom_man', name: 'Mushroom Man', type: 'boss1', emoji: '🍄', hp: 3, color: '#a855f7' },
      { id: 'oak_dragon', name: 'Oak Dragon', type: 'boss2', emoji: '🐉', hp: 3, color: '#16a34a' },
      { id: 'tree_sentinel', name: 'Tree Sentinel', type: 'final', emoji: '🌳', hp: 3, color: '#15803d', isFinal: true },
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean Zone',
    grade: 4,
    color: '#3b82f6',
    emoji: '🌊',
    bg: 'from-blue-900 via-blue-800 to-cyan-900',
    description: 'Read longer texts and analyze plot structure, themes, and opinion writing.',
    bosses: [
      { id: 'hammerhead', name: 'Hammerhead Shark', type: 'boss1', emoji: '🦈', hp: 3, color: '#0ea5e9' },
      { id: 'temple_guardian', name: 'Temple Guardian', type: 'boss2', emoji: '🏛️', hp: 3, color: '#1d4ed8' },
      { id: 'lord_7_seas', name: 'Lord of the 7 Seas', type: 'final', emoji: '👑', hp: 3, color: '#1e40af', isFinal: true },
    ]
  },
  {
    id: 'ice',
    name: 'Ice Zone',
    grade: 6,
    color: '#67e8f9',
    emoji: '❄️',
    bg: 'from-slate-800 via-cyan-900 to-blue-900',
    description: 'Analyze novels, nonfiction articles, and write persuasive multi-paragraph essays.',
    bosses: [
      { id: 'woolly_mammoth', name: 'Great Woolly Mammoth', type: 'boss1', emoji: '🦣', hp: 3, color: '#94a3b8' },
      { id: 'ice_spirit', name: 'Ice Spirit', type: 'boss2', emoji: '👻', hp: 3, color: '#7dd3fc' },
      { id: 'ice_giant', name: 'Ice Giant', type: 'final', emoji: '🧊', hp: 3, color: '#38bdf8', isFinal: true },
    ]
  },
  {
    id: 'desert',
    name: 'Desert Zone',
    grade: 5,
    color: '#f59e0b',
    emoji: '🏜️',
    bg: 'from-orange-900 via-yellow-900 to-amber-900',
    description: 'Master inference and evidence-based answers with detailed essays and research.',
    bosses: [
      { id: 'wraith', name: 'Wraith', type: 'boss1', emoji: '💀', hp: 3, color: '#a16207' },
      { id: 'mummy_spirit', name: 'Spirit of a Mummy', type: 'boss2', emoji: '🧟', hp: 3, color: '#ca8a04' },
      { id: 'sand_god', name: 'The Sand God', type: 'final', emoji: '⚡', hp: 3, color: '#d97706', isFinal: true },
    ]
  },
  {
    id: 'mountain',
    name: 'Mountain Zone',
    grade: 3,
    color: '#a78bfa',
    emoji: '⛰️',
    bg: 'from-stone-900 via-slate-800 to-purple-900',
    description: 'Climb to chapter books and informational texts while summarizing and comparing characters.',
    bosses: [
      { id: 'mountain_golem', name: 'Mountain Golem', type: 'boss1', emoji: '🗿', hp: 3, color: '#78716c' },
      { id: 'elder_golem', name: 'Elder Golem', type: 'boss2', emoji: '🏔️', hp: 3, color: '#57534e' },
      { id: 'golem_king', name: 'Golem King', type: 'final', emoji: '👑', hp: 3, color: '#44403c', isFinal: true },
    ]
  },
  {
    id: 'underground',
    name: 'Underground Zone',
    grade: 0,
    color: '#8b5cf6',
    emoji: '🕳️',
    bg: 'from-purple-950 via-indigo-950 to-slate-900',
    description: 'Explore the dark caverns hidden beneath the surface.',
    bosses: [
      { id: 'mineral_spirit', name: 'Mineral Spirit', type: 'boss1', emoji: '💎', hp: 3, color: '#7c3aed' },
      { id: 'shadow_monster', name: 'Shadow Monster', type: 'boss2', emoji: '🌑', hp: 3, color: '#4c1d95' },
      { id: 'lord_shadows', name: 'Lord of the Shadows', type: 'final', emoji: '😈', hp: 3, color: '#2e1065', isFinal: true },
    ]
  },
  {
    id: 'drylands',
    name: 'Storm Zone',
    grade: 7,
    color: '#fb923c',
    emoji: '⛈️',
    bg: 'from-orange-950 via-red-950 to-stone-900',
    description: 'Analyze symbolism, write argumentative essays, and complete research projects.',
    bosses: [
      { id: 'wasteland_scavenger', name: 'Wasteland Scavenger', type: 'boss1', emoji: '🦅', hp: 3, color: '#c2410c' },
      { id: 'mechanical_golem', name: 'Mechanical Golem', type: 'boss2', emoji: '🤖', hp: 3, color: '#9a3412' },
      { id: 'drylands_demon', name: 'Drylands Demon', type: 'final', emoji: '👿', hp: 3, color: '#7c2d12', isFinal: true },
    ]
  },
  {
    id: 'fire',
    name: 'Fire Zone',
    grade: 8,
    color: '#ef4444',
    emoji: '🔥',
    bg: 'from-red-950 via-orange-900 to-red-900',
    description: 'The final stage — master literary analysis, thesis writing, and long-form reading for high school readiness.',
    bosses: [
      { id: 'fire_spirit', name: 'Fire Spirit', type: 'boss1', emoji: '🔥', hp: 3, color: '#dc2626' },
      { id: 'nether_guardian', name: 'Guardian of the Nether Gates', type: 'boss2', emoji: '⚔️', hp: 3, color: '#b91c1c' },
      { id: 'lord_netherlands', name: 'The Lord of the Nether', type: 'final', emoji: '💀', hp: 3, color: '#7f1d1d', isFinal: true },
    ]
  },
];

export const ACHIEVEMENTS = {
  global: [
    {
      id: 'consistent_player',
      name: 'Consistent Player',
      description: 'Hours of activity',
      icon: '⏱️',
      tiers: [
        { tier: 'bronze', label: 'Bronze', requirement: 1, unit: 'hours', color: '#cd7f32' },
        { tier: 'silver', label: 'Silver', requirement: 3, unit: 'hours', color: '#c0c0c0' },
        { tier: 'gold', label: 'Gold', requirement: 7, unit: 'hours', color: '#ffd700' },
        { tier: 'platinum', label: 'Platinum', requirement: 12, unit: 'hours', color: '#e5e4e2' },
        { tier: 'emerald', label: 'Emerald', requirement: 18, unit: 'hours', color: '#50c878' },
        { tier: 'ruby', label: 'Ruby', requirement: 24, unit: 'hours', color: '#e0115f' },
        { tier: 'sapphire', label: 'Sapphire', requirement: 36, unit: 'hours', color: '#0f52ba' },
        { tier: 'diamond', label: 'Diamond', requirement: 45, unit: 'hours', color: '#b9f2ff' },
      ]
    },
    {
      id: 'streak_warrior',
      name: 'Streak Warrior',
      description: 'Day streaks',
      icon: '🔥',
      tiers: [
        { tier: 'bronze', label: 'Bronze', requirement: 1, unit: 'days', color: '#cd7f32' },
        { tier: 'silver', label: 'Silver', requirement: 5, unit: 'days', color: '#c0c0c0' },
        { tier: 'gold', label: 'Gold', requirement: 15, unit: 'days', color: '#ffd700' },
        { tier: 'platinum', label: 'Platinum', requirement: 25, unit: 'days', color: '#e5e4e2' },
        { tier: 'emerald', label: 'Emerald', requirement: 40, unit: 'days', color: '#50c878' },
        { tier: 'ruby', label: 'Ruby', requirement: 60, unit: 'days', color: '#e0115f' },
        { tier: 'sapphire', label: 'Sapphire', requirement: 80, unit: 'days', color: '#0f52ba' },
        { tier: 'diamond', label: 'Diamond', requirement: 100, unit: 'days', color: '#b9f2ff' },
      ]
    },
    {
      id: 'word_collector',
      name: 'Word Collector',
      description: 'New words learned',
      icon: '📚',
      tiers: [
        { tier: 'bronze', label: 'Bronze', requirement: 1, unit: 'words', color: '#cd7f32' },
        { tier: 'silver', label: 'Silver', requirement: 3, unit: 'words', color: '#c0c0c0' },
        { tier: 'gold', label: 'Gold', requirement: 5, unit: 'words', color: '#ffd700' },
        { tier: 'platinum', label: 'Platinum', requirement: 9, unit: 'words', color: '#e5e4e2' },
        { tier: 'emerald', label: 'Emerald', requirement: 15, unit: 'words', color: '#50c878' },
        { tier: 'ruby', label: 'Ruby', requirement: 25, unit: 'words', color: '#e0115f' },
        { tier: 'sapphire', label: 'Sapphire', requirement: 50, unit: 'words', color: '#0f52ba' },
        { tier: 'diamond', label: 'Diamond', requirement: 75, unit: 'words', color: '#b9f2ff' },
      ]
    },
    {
      id: 'comprehension_master',
      name: 'Comprehension Master',
      description: 'Comprehension questions answered',
      icon: '🧠',
      tiers: [
        { tier: 'bronze', label: 'Bronze', requirement: 10, unit: 'questions', color: '#cd7f32' },
        { tier: 'silver', label: 'Silver', requirement: 20, unit: 'questions', color: '#c0c0c0' },
        { tier: 'gold', label: 'Gold', requirement: 30, unit: 'questions', color: '#ffd700' },
        { tier: 'platinum', label: 'Platinum', requirement: 40, unit: 'questions', color: '#e5e4e2' },
        { tier: 'emerald', label: 'Emerald', requirement: 50, unit: 'questions', color: '#50c878' },
        { tier: 'ruby', label: 'Ruby', requirement: 60, unit: 'questions', color: '#e0115f' },
        { tier: 'sapphire', label: 'Sapphire', requirement: 80, unit: 'questions', color: '#0f52ba' },
        { tier: 'diamond', label: 'Diamond', requirement: 100, unit: 'questions', color: '#b9f2ff' },
      ]
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Perfect quiz scores',
      icon: '⭐',
      tiers: [
        { tier: 'bronze', label: 'Bronze', requirement: 3, unit: 'quizzes', color: '#cd7f32' },
        { tier: 'silver', label: 'Silver', requirement: 6, unit: 'quizzes', color: '#c0c0c0' },
        { tier: 'gold', label: 'Gold', requirement: 9, unit: 'quizzes', color: '#ffd700' },
        { tier: 'platinum', label: 'Platinum', requirement: 12, unit: 'quizzes', color: '#e5e4e2' },
        { tier: 'emerald', label: 'Emerald', requirement: 15, unit: 'quizzes', color: '#50c878' },
        { tier: 'ruby', label: 'Ruby', requirement: 18, unit: 'quizzes', color: '#e0115f' },
        { tier: 'sapphire', label: 'Sapphire', requirement: 21, unit: 'quizzes', color: '#0f52ba' },
        { tier: 'diamond', label: 'Diamond', requirement: 24, unit: 'quizzes', color: '#b9f2ff' },
      ]
    },
  ],
  zone: {
    forest: [
      { id: 'forest_beginner', name: 'Forest Beginner', description: 'Defeat the Mushroom Man and complete the quiz', icon: '🍄', boss: 'mushroom_man' },
      { id: 'woodland_scholar', name: 'Woodland Scholar', description: 'Defeat the Oak Dragon and complete the quiz', icon: '🐉', boss: 'oak_dragon' },
      { id: 'forest_guardian', name: 'Forest Guardian', description: 'Defeat the Tree Sentinel and complete the final quiz', icon: '🌳', boss: 'tree_sentinel' },
    ],
    ocean: [
      { id: 'ocean_navigator', name: 'Ocean Navigator', description: 'Defeat the Hammerhead Shark and complete the quiz', icon: '🦈', boss: 'hammerhead' },
      { id: 'wave_scholar', name: 'Wave Scholar', description: 'Defeat the Temple Guardian and complete the quiz', icon: '🏛️', boss: 'temple_guardian' },
      { id: 'current_master', name: 'Current Master', description: 'Defeat the Lord of the 7 Seas and complete the final quiz', icon: '👑', boss: 'lord_7_seas' },
    ],
    ice: [
      { id: 'frozen_thinker', name: 'Frozen Thinker', description: 'Defeat the Great Woolly Mammoth and complete the quiz', icon: '🦣', boss: 'woolly_mammoth' },
      { id: 'ice_scholar', name: 'Ice Scholar', description: 'Defeat the Ice Spirit and complete the quiz', icon: '👻', boss: 'ice_spirit' },
      { id: 'blizzard_reader', name: 'Blizzard Reader', description: 'Defeat the Ice Giant and complete the final quiz', icon: '🧊', boss: 'ice_giant' },
    ],
    desert: [
      { id: 'desert_survivor', name: 'Desert Survivor', description: 'Defeat the Wraith and complete the quiz', icon: '💀', boss: 'wraith' },
      { id: 'sandstorm_scholar', name: 'Sandstorm Scholar', description: 'Defeat the Spirit of a Mummy and complete the quiz', icon: '🧟', boss: 'mummy_spirit' },
      { id: 'dune_master', name: 'Dune Master', description: 'Defeat the Sand God and complete the final quiz', icon: '⚡', boss: 'sand_god' },
    ],
    mountain: [
      { id: 'mountain_climber', name: 'Mountain Climber', description: 'Defeat the Mountain Golem and complete the quiz', icon: '🗿', boss: 'mountain_golem' },
      { id: 'summit_scholar', name: 'Summit Scholar', description: 'Defeat the Elder Golem and complete the quiz', icon: '🏔️', boss: 'elder_golem' },
      { id: 'mountain_champion', name: 'Mountain Champion', description: 'Defeat the Golem King and complete the final quiz', icon: '👑', boss: 'golem_king' },
    ],
    underground: [
      { id: 'cave_explorer', name: 'Cave Explorer', description: 'Defeat the Mineral Spirit and complete the quiz', icon: '💎', boss: 'mineral_spirit' },
      { id: 'cavern_scholar', name: 'Cavern Scholar', description: 'Defeat the Shadow Monster and complete the quiz', icon: '🌑', boss: 'shadow_monster' },
      { id: 'lord_underground', name: 'Lord of the Underground', description: 'Defeat the Lord of the Shadows and complete the final quiz', icon: '😈', boss: 'lord_shadows' },
    ],
    drylands: [
      { id: 'drylands_explorer', name: 'Drylands Explorer', description: 'Defeat the Wasteland Scavenger and complete the quiz', icon: '🦅', boss: 'wasteland_scavenger' },
      { id: 'wasteland_scholar', name: 'Wasteland Scholar', description: 'Defeat the Mechanical Golem and complete the quiz', icon: '🤖', boss: 'mechanical_golem' },
      { id: 'drylands_conqueror', name: 'Drylands Conqueror', description: 'Defeat the Drylands Demon and complete the final quiz', icon: '👿', boss: 'drylands_demon' },
    ],
    fire: [
      { id: 'abyss_explorer', name: 'Abyss Explorer', description: 'Defeat the Fire Spirit and complete the quiz', icon: '🔥', boss: 'fire_spirit' },
      { id: 'netherlands_scholar', name: 'Netherlands Scholar', description: 'Defeat the Guardian of the Nether Gates and complete the quiz', icon: '⚔️', boss: 'nether_guardian' },
      { id: 'world_champion', name: 'World Champion', description: 'Defeat the Lord of the Nether and complete the final quiz', icon: '💀', boss: 'lord_netherlands' },
    ],
  }
};

export const GRADE_LEARNING = {
  1: {
    title: '1st Grade — Forest Zone',
    focusAreas: ['Sight words', 'Simple sentence reading', 'Basic comprehension', 'Short sentence writing', 'Vocabulary building'],
    exampleAchievement: '"First Book Hero" → Finish 5 beginner books',
    description: 'Build confidence with short stories, picture books, and beginner vocabulary. Goals are easy and encouraging!',
  },
  2: {
    title: '2nd Grade — River Zone',
    focusAreas: ['Reading fluency', 'Main idea', 'Character identification', 'Paragraph writing', 'Grammar basics'],
    exampleAchievement: '"Paragraph Pro" → Write 10 complete paragraphs',
    description: 'Begin reading slightly longer stories and practice identifying themes, characters, and settings. Writing expands into short paragraphs.',
  },
  3: {
    title: '3rd Grade — Mountain Zone',
    focusAreas: ['Summarizing', 'Compare & contrast', 'Informational reading', 'Descriptive writing', 'Vocabulary expansion'],
    exampleAchievement: '"Book Explorer" → Read books from 3 genres',
    description: 'Reading challenges include chapter books and informational texts. Begin summarizing stories and comparing characters.',
  },
  4: {
    title: '4th Grade — Ocean Zone',
    focusAreas: ['Theme analysis', 'Context clues', 'Opinion writing', 'Story structure', 'Reading stamina'],
    exampleAchievement: '"Consistent Reader" → Read 20 days in a row',
    description: 'Read longer texts and begin analyzing plot structure and themes. Writing tasks introduce opinion writing and stronger paragraph structure.',
  },
  5: {
    title: '5th Grade — Desert Zone',
    focusAreas: ['Inference skills', 'Supporting evidence', 'Essay writing', 'Research skills', 'Advanced grammar'],
    exampleAchievement: '"Essay Expert" → Complete 5 full essays',
    description: 'Complete advanced reading comprehension with inference and evidence-based answers. Writing becomes more detailed with essays and research summaries.',
  },
  6: {
    title: '6th Grade — Ice Zone',
    focusAreas: ['Literary analysis', 'Persuasive writing', 'Point of view', 'Text evidence', 'Editing & revising'],
    exampleAchievement: '"Critical Thinker" → Complete advanced comprehension challenges',
    description: 'Analyze novels, nonfiction articles, and complex themes. Writing assignments include persuasive essays and multi-paragraph responses.',
  },
  7: {
    title: '7th Grade — Storm Zone',
    focusAreas: ['Symbolism', 'Argumentative writing', 'Research projects', 'Advanced vocabulary', 'Tone & mood analysis'],
    exampleAchievement: '"Golden Reader" → Maintain a 30-day reading streak',
    description: 'Reading focuses on deeper analysis, symbolism, and comparing multiple texts. Writing includes argumentative essays, creative storytelling, and research projects.',
  },
  8: {
    title: '8th Grade — Fire Zone',
    focusAreas: ['Critical analysis', 'Thesis statements', 'Research writing', 'Complex nonfiction', 'Advanced essay structure'],
    exampleAchievement: '"Fire Master" → Complete all major reading and writing challenges',
    description: 'The final stage — advanced literary analysis, research-based writing, and long-form reading challenges. Prepares players for high school-level literacy.',
  },
};

export const TIER_CONFIG = {
  bronze: { label: 'Bronze', color: '#cd7f32', bg: 'rgba(205,127,50,0.15)', border: 'rgba(205,127,50,0.4)' },
  silver: { label: 'Silver', color: '#c0c0c0', bg: 'rgba(192,192,192,0.15)', border: 'rgba(192,192,192,0.4)' },
  gold: { label: 'Gold', color: '#ffd700', bg: 'rgba(255,215,0,0.15)', border: 'rgba(255,215,0,0.4)' },
  platinum: { label: 'Platinum', color: '#e5e4e2', bg: 'rgba(229,228,226,0.15)', border: 'rgba(229,228,226,0.4)' },
  emerald: { label: 'Emerald', color: '#50c878', bg: 'rgba(80,200,120,0.15)', border: 'rgba(80,200,120,0.4)' },
  ruby: { label: 'Ruby', color: '#e0115f', bg: 'rgba(224,17,95,0.15)', border: 'rgba(224,17,95,0.4)' },
  sapphire: { label: 'Sapphire', color: '#0f52ba', bg: 'rgba(15,82,186,0.15)', border: 'rgba(15,82,186,0.4)' },
  diamond: { label: 'Diamond', color: '#b9f2ff', bg: 'rgba(185,242,255,0.15)', border: 'rgba(185,242,255,0.4)' },
};


