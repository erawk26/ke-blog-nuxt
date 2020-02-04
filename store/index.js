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
  },
  basicPages: [],
  newsPosts: []
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
  },
  setNewsPosts(state, list) {
    state.newsPosts = list
  },
  setPages(state, list) {
    state.basicPages = list
  }
}
export const actions = {
  async nuxtServerInit({ commit }) {
    const files1 = await require.context(
      '~/assets/content/news/',
      false,
      /\.json$/
    )
    const newsPosts = files1.keys().map((key) => {
      const res = files1(key)
      res.slug = key.slice(2, -5)
      return res
    })
    const files2 = await require.context(
      '~/assets/content/pages/',
      false,
      /\.json$/
    )
    const basicPages = files2.keys().map((key) => {
      const res = files2(key)
      res.slug = key.slice(2, -5)
      return res
    })
    await commit('setPages', basicPages)
    await commit('setNewsPosts', newsPosts)
  }
}
