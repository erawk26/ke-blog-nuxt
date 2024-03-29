// import { company } from '~/site.info.js'
const company = JSON.parse(process.env.NUXT_ENV_COMPANY_INFO)
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
        icon: 'news',
        title: 'News',
        to: '/news'
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
  setPages(state, list) {
    state.basicPages = list
    list.forEach((item) => {
      state.menus.main.push({
        external: false,
        icon: item.icon || null,
        title: item.title,
        to: '/' + item.slug
      })
    })
  },
  setNewsPosts(state, list) {
    const i = state.menus.main.map((x) => x.to).indexOf('/news')
    state.newsPosts = list
    const submenu = list.map((x) => ({
      external: false,
      icon: null,
      title: x.title,
      to: '/news/' + x.slug
    }))
    state.menus.main[i].submenu = submenu
  },
  setAlbums(state, list) {
    state.albums = list
  }
}
export const actions = {
  async nuxtServerInit({ commit }) {
    const getFiles = (arr) =>
      arr.keys().map((key) => {
        const res = arr(key)
        res.slug = key.slice(2, -5)
        return res
      })
    const files1 = await require.context(
      '~/assets/content/pages/',
      false,
      /\.json$/
    )
    const files2 = await require.context(
      '~/assets/content/news/',
      false,
      /\.json$/
    )
    const files3 = await require.context(
      '~/assets/content/album/',
      false,
      /\.json$/
    )
    const clientSchedules = await this.$axios.$get('/dev/schedules')

    commit('setPages', getFiles(files1))
    commit('setNewsPosts', getFiles(files2))
    commit('setAlbums', getFiles(files3))
    commit('SET_STATE', { key: 'clientSchedules', data: clientSchedules })
  }
}
