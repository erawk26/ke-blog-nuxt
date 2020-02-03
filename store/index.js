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
        title: 'Home',
        to: '/'
      },
      {
        external: false,
        icon: 'home',
        title: 'News',
        to: '/news'
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
        title: 'Biography',
        to: '/bio'
      },
      {
        external: false,
        icon: 'home',
        title: 'Parners',
        to: '/partners'
      },
      {
        external: false,
        icon: 'home',
        title: 'Contact',
        to: '/contact'
      }
    ],
    footer: [
      {
        external: false,
        icon: 'mail_outline',
        to: '/contact',
        title: company.email
      },
      // {
      //   external: true,
      //   icon: 'mdi-linkedin-box',
      //   href: `https://www.linkedin.com/in/${company.linkedin}`,
      //   title: 'LinkedIn'
      // },
      {
        external: true,
        icon: 'mdi-facebook',
        href: `https://www.facebook.com/${company.facebook}`,
        title: 'FaceBook'
      },
      {
        external: true,
        icon: 'mdi-instagram',
        href: `https://www.instagram.com/${company.instagram}`,
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
