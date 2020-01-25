import { company } from '~/site.info.js'
export const state = () => ({
  siteInfo: {
    company
  },
  menus: {
    main: [
      {
        external: false,
        icon: 'home',
        title: 'Intro',
        to: '/'
      },
      {
        external: false,
        icon: 'home',
        title: 'Services',
        to: '/services'
      },
      {
        external: false,
        icon: 'home',
        title: 'Contact',
        to: '/contact'
      },
      {
        external: false,
        icon: 'home',
        title: 'About',
        to: '/about'
      },
      {
        external: true,
        icon: 'mdi-file-pdf',
        title: 'Resume',
        href: './XXX_Resume.pdf'
      }
    ],
    footer: [
      {
        external: false,
        icon: 'mail_outline',
        to: '/contact',
        title: company.email
      },
      {
        external: true,
        icon: 'mdi-linkedin-box',
        href: 'https://www.linkedin.com/in/XXXXXXXXXXXXX',
        title: 'LinkedIn'
      },
      {
        external: true,
        icon: 'mdi-github-circle',
        href: 'https://github.com/XXXXXXXXXXXXX',
        title: 'GitHub'
      },
      {
        external: true,
        icon: 'mdi-codepen',
        href: 'https://codepen.io/XXXXXXXXXXXXX',
        title: 'CodePen'
      },
      {
        external: true,
        icon: 'mdi-instagram',
        href: 'https://www.instagram.com/XXXXXXXXXXXXX',
        title: 'Instagram'
      }
    ]
  }
})

export const mutations = {
  SET_STATE(state, payload) {
    state[payload.key] = payload.data
  },
  ADD_SUBMENU(state, payload) {
    const i = state.menus.main.map((x) => x.to).indexOf(payload.key)
    state.menus.main[i].submenu = payload.menu.map((x) => ({
      external: false,
      icon: null,
      title: x.title,
      to: payload.key + '/' + x.slug
    }))
  }
}
