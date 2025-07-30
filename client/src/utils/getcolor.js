const avatarColors = [
  '#4B8B9E', // teal-gray
  '#5E7C88', // muted steel blue
  '#6A994E', // muted green
  '#B85C5C', // dusty red
  '#8E6C8A', // soft purple
  '#A47148', // muted brown
  '#59788E', // slate blue
  '#546E7A', // blue gray
  '#7C8C5F', // olive green
  '#9E6F5C'  // brick peach
];


export function getAvatarColor(name = "default") {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return avatarColors[sum % avatarColors.length];
}
