import domInit from './domInit'
import { siteRefresh } from './refresh'
import { cloudflareInit } from '../components/cloudflare'
import { BODY, CONFIG, setSiteSearch, siteSearch } from '../globals/globalVars'
import { autoDarkmode, themeColorListener } from '../globals/themeColor'
import { resizeHandle, scrollHandle, visibilityListener } from '../globals/handles'
import { pagePosition } from '../globals/tools'
import { initVue } from '../library/vue'
import { $dom } from '../library/dom'
import { createChild } from '../library/proto'
import { transition } from '../library/anime'

const siteInit = async () => {
  initVue()
  domInit()

  autoDarkmode()

  if (__shokax_VL__) {
    visibilityListener()
  }
  themeColorListener()

  if (__shokax_search__) {
    document.querySelector('li.item.search > i').addEventListener('click', () => {
      if (CONFIG.search === null) {
        return
      }

      if (!siteSearch) {
        setSiteSearch(createChild(BODY, 'div', {
          id: 'search',
          innerHTML: '<div class="inner"><div class="header"><span class="icon"><i class="ic i-search"></i></span><div class="search-input-container"></div><span class="close-btn"><i class="ic i-times-circle"></i></span></div><div class="results"><div class="inner"><div id="search-stats"></div><div id="search-hits"></div><div id="search-pagination"></div></div></div></div>'
        }))
      }

      import('../page/search').then(({algoliaSearch}) => {
        algoliaSearch()
      })

      // Handle and trigger popup window
      // TODO search 只有一个，不需要 each
      $dom.each('.search', (element) => {
        element.addEventListener('click', () => {
          document.body.style.overflow = 'hidden'
          transition(siteSearch, 'shrinkIn', () => {
            (document.querySelector('.search-input') as HTMLInputElement).focus()
          }) // transition.shrinkIn
        })
      })
    }, {once: true, capture: true})
  }

  if (__shokax_fireworks__) {
    import('mouse-firework').then((firework) => {
      firework.default(CONFIG.fireworks)
    })
  }

  window.addEventListener('scroll', scrollHandle, {
    passive: true
  })

  window.addEventListener('resize', resizeHandle, {
    passive: true
  })

  window.addEventListener('beforeunload', () => {
    pagePosition()
  })
  await siteRefresh(1)
  // TODO 修复内页跳转后重复出现加载动画的问题
}

cloudflareInit()

window.addEventListener('DOMContentLoaded', siteInit, {
  passive: true
})

console.log('%c Theme.ShokaX v' + CONFIG.version + ' %c https://github.com/theme-shoka-x/hexo-theme-shokaX ', 'color: white; background: #e9546b; padding:5px 0;', 'padding:4px;border:1px solid #e9546b;')
