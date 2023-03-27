export default function generateUsername(): string {
  const adjectives: string[] = ['Breezy', 'Sunny', 'Cloudy', 'Leafy', 'Green', 'Rustling', 'Gentle', 'Whistling', 'Fluttering', 'Fluffy', 'Swirling', 'Misty', 'Dancing', 'Twinkling', 'Golden', 'Shimmering', 'Glittering', 'Sparkling', 'Radiant', 'Luminous', 'Serene', 'Peaceful', 'Calm', 'Tranquil', 'Dreamy', 'Melodic', 'Harmonious', 'Majestic', 'Mystical', 'Magical', 'Enchanted', 'Whimsical', 'Fantastical', 'Ethereal', 'Heavenly', 'Celestial', 'Cosmic', 'Elevated'];
  const nouns: string[] = ['Breeze', 'Sky', 'Cloud', 'Leaf', 'Tree', 'Branch', 'Sapling', 'Sprout', 'Twig', 'Canopy', 'Foliage', 'Forest', 'Meadow', 'Grove', 'Woodland', 'Orchard', 'Arbor', 'Garden', 'Wilderness', 'Thicket', 'Copse', 'Jungle', 'Tropical', 'Palm', 'Maple', 'Oak', 'Birch', 'Willow', 'Pine', 'Redwood', 'Sequoia', 'Cedar', 'Cypress', 'Magnolia', 'Cherry', 'Blossom', 'Flower', 'Petals', 'Ivy', 'Vine', 'Moss', 'Lichen', 'Fern'];
  
  const adjective: string = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun: string = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumbers: string = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${adjective}${noun}${randomNumbers}`;
}