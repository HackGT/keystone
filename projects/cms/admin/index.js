import Home from './pages/home'

export default {
  pages: () => [
    {
      label: 'Home',
      path: '',
      component: Home,
    },
    {
      label: "Hackathon",
      children: [
        {
          label: 'Schedule',
          children: ['Event', 'Location', 'Tag']
        },
        {
          label: 'Content',
          children: ['FAQ', 'Block', 'BrandAsset', 'SocialAccount']
        },
        {
          label: 'Sponsors',
          children: ['Sponsor', 'Perk', 'Challenge']
        }
      ]
    },
    {
      label: "Admin",
      children: [
        'User', 'Hackathon', 'Type'
      ]
    }
  ]
};
