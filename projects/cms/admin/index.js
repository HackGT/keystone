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
          children: ['Event', 'Location']
        },
        {
          label: 'Content',
          children: ['FAQ', 'Block', 'Sponsor', 'SocialAccount']
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
