export const keys = [
  'vintage', 'creative', 'antique', 'furniture', 'decor'
];

export const categories = [
  'vintage', 'creative', 'antique'
];

export const filters = [
  'furniture', 'decor'
];

export const titles = {
  vintage: 'Vintage',
  creative: 'Creative',
  antique: 'Antique',
  furniture: 'Furniture',
  decor: 'Decor'
};

export const excludes = {
  vintage: ['creative', 'antique'],
  creative: ['vintage', 'antique'],
  antique: ['creative', 'vintage'],
  furniture: ['decor'],
  decor: ['furniture']
};

export const options = keys.map(key => {
  return {
    value: key, label: titles[key]
  }
});

export const getPageId = (tags) => {
  let result;

  if(tags) {
    tags.some(tag => {
      if(tag === 'vintage' || tag === 'creative' || tag === 'antique') {
        result = tag;
        return true;
      }
    });
  }

  return result;
}

export const pageTitle = (id) => {
  switch(id) {
    case 'vintage':
      return 'Vintage Collection';
    case 'creative':
      return 'Creative Collection';
    case 'antique':
      return 'Antique Collection';
    default:
      return 'Savvy Collection';
  }
};

export const pageText = (id) => {
  switch(id) {
    case 'vintage':
      return 'Our Vintage Collection features classic furniture and home decor that we give a fresh look.';
    case 'creative':
      return 'Our Creative Collection features our upcycled decor and furniture created from recovered material.';
    case 'antique':
      return 'Our Antique Collection features treasures from the past that needs nothing more than a light cleaning.';
    default:
      return 'Savvy Creations searches the secondary market for furniture and decor that have been forgotten and/or neglected.  We take these treasures and reimagine them.'
    }
};
