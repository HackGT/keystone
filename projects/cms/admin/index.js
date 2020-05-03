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
          children: ['Event', 'Location', 'Type']
        },
        {
          label: 'Content',
          children: ['FAQ', 'Block']
        }
      ]
    },
    {
      label: "Admin",
      children: [
        'User', 'Hackathon'
      ]
    }
  ]
};
