/**
 * ACCESSBRIDGE Embed SDK (Track 2: Accessible Learning Media)
 * Enables seamless script-tag integration into host LMS platforms such as ALX Savanna.
 * 
 * Usage:
 * <div id="accessbridge-player" data-lesson-id="default" data-lang="am" data-theme="light"></div>
 * <script src="/accessbridge.js" defer></script>
 */
;(function (window, document) {
  'use strict'

  function initAccessBridgePlayer() {
    var containers = document.querySelectorAll('[data-accessbridge-embed], #accessbridge-player')
    if (!containers || containers.length === 0) return

    containers.forEach(function (container) {
      if (container.dataset.initialized) return
      container.dataset.initialized = 'true'

      var lessonId = container.getAttribute('data-lesson-id') || 'default'
      var lang = container.getAttribute('data-lang') || 'en'
      var theme = container.getAttribute('data-theme') || 'light'
      var apiUrl = container.getAttribute('data-api-url') || '/api/v1'

      // Render embeddable accessible iframe / player surface
      var iframe = document.createElement('iframe')
      iframe.src = window.location.origin + '/?embed=true&lesson=' + encodeURIComponent(lessonId) + '&lang=' + encodeURIComponent(lang) + '&theme=' + encodeURIComponent(theme) + '&api=' + encodeURIComponent(apiUrl)
      iframe.title = 'AccessBridge Accessible Learning Media Player'
      iframe.style.width = '100%'
      iframe.style.height = '600px'
      iframe.style.border = '1px solid #cbd5e1'
      iframe.style.borderRadius = '8px'
      iframe.style.overflow = 'hidden'
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
      iframe.setAttribute('allowfullscreen', 'true')

      container.innerHTML = ''
      container.appendChild(iframe)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessBridgePlayer)
  } else {
    initAccessBridgePlayer()
  }

  window.AccessBridge = {
    init: initAccessBridgePlayer,
    version: '1.0.0',
    platform: 'AccessLearn Ethiopia (Digital Bridge Hackathon 2026)',
  }
})(window, document)
