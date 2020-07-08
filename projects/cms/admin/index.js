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
          children: ['FAQ', 'Block', 'Sponsor', 'BrandAsset', 'SocialAccount']
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
