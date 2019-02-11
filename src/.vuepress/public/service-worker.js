/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "b5cad12ebfbf084a119060d4f01df073"
  },
  {
    "url": "abduction.svg",
    "revision": "ef6dc31a4fa8384ba0cb717e83863a6e"
  },
  {
    "url": "about/index.html",
    "revision": "5cd4b27f2ce31432dbe450b8375b79ac"
  },
  {
    "url": "assets/css/0.styles.fcaf382f.css",
    "revision": "fea13dd397000b79612d97b9972c4244"
  },
  {
    "url": "assets/fonts/hack-regular.3eccb984.woff2",
    "revision": "3eccb984a54973a75212391b6d117ace"
  },
  {
    "url": "assets/fonts/hack-regular.b038bd31.woff",
    "revision": "b038bd31fef76bc622d123ae8892efa2"
  },
  {
    "url": "assets/fonts/ktquez.06665560.eot",
    "revision": "066655605108d4a0ae74dcc69bbe7547"
  },
  {
    "url": "assets/fonts/ktquez.87607358.woff",
    "revision": "876073588156b8e621394e0705ed0695"
  },
  {
    "url": "assets/fonts/ktquez.9d97d905.ttf",
    "revision": "9d97d905fd7b9fc68d637ac83de00744"
  },
  {
    "url": "assets/img/github-add-webhook.70b9dd52.png",
    "revision": "70b9dd520aed3b4e824435440a56f305"
  },
  {
    "url": "assets/img/github-repo-webhooks.44f4478a.png",
    "revision": "44f4478ad77b3651fac349a13a25f437"
  },
  {
    "url": "assets/img/http-github-url-secret.d50304b6.png",
    "revision": "d50304b68ad6e851b3abc07dbfeaa64b"
  },
  {
    "url": "assets/img/ktquez.8ef6334d.svg",
    "revision": "8ef6334db409a3a48aea2e38db558893"
  },
  {
    "url": "assets/img/MissingPartialConfiguration.6c05e33a.png",
    "revision": "6c05e33a564159385197930953b17121"
  },
  {
    "url": "assets/img/powershell-http-function.9c214267.png",
    "revision": "9c21426742c013862b2e601dd1594ff8"
  },
  {
    "url": "assets/img/powershell-http-github-trigger.76379f90.png",
    "revision": "76379f9086fc9e8cec0a59cab56b34b4"
  },
  {
    "url": "assets/img/timer.5d30edff.jpg",
    "revision": "5d30edffeee029c92eb730b3c0db554d"
  },
  {
    "url": "assets/js/1.a4f33888.js",
    "revision": "0dbd2e6a2d922e93cf00a7cbe73e8541"
  },
  {
    "url": "assets/js/10.e53d71c6.js",
    "revision": "ed796e6877560bb8e59357c022e504c7"
  },
  {
    "url": "assets/js/11.4fc92e8e.js",
    "revision": "0eff278af2cf1d8eb6d1827359738c67"
  },
  {
    "url": "assets/js/12.09429300.js",
    "revision": "699667397c93eecef0d63cdb727712b9"
  },
  {
    "url": "assets/js/13.d34cdf33.js",
    "revision": "93aca3c2fe254ca2c8a37607134b8017"
  },
  {
    "url": "assets/js/14.246cb864.js",
    "revision": "0f1606d57f777c8882f4114ee2d67b82"
  },
  {
    "url": "assets/js/15.3cd33e83.js",
    "revision": "86721419a083e25d6d2b47da60c218da"
  },
  {
    "url": "assets/js/16.4fd1d596.js",
    "revision": "1a283a76ba3c54f68fa00b199f566736"
  },
  {
    "url": "assets/js/17.97598e56.js",
    "revision": "546ccbed63f3bc0ab798721bbb1f4aa7"
  },
  {
    "url": "assets/js/18.bcb55f75.js",
    "revision": "b1c2b1beaa4447c2a6bdf861066c615c"
  },
  {
    "url": "assets/js/19.b9109b92.js",
    "revision": "ec47b97f55c4b92096218dd25c0782eb"
  },
  {
    "url": "assets/js/2.5a3e4d52.js",
    "revision": "c10bd7824da31bf67a4900239aa3e990"
  },
  {
    "url": "assets/js/20.a53c7592.js",
    "revision": "621e41081ef5ac384b156c31e954eff8"
  },
  {
    "url": "assets/js/21.b195ee89.js",
    "revision": "38ba11996a15807add02ffdb4e22c456"
  },
  {
    "url": "assets/js/22.26ef9200.js",
    "revision": "63de38e5b2b00c46d4ad2faefdc6f34a"
  },
  {
    "url": "assets/js/23.0d3d019e.js",
    "revision": "11c677fdfbc5c022ff39b25ff1c53202"
  },
  {
    "url": "assets/js/24.826f4472.js",
    "revision": "013bc56fe0dba4c1551eda10a2093ea2"
  },
  {
    "url": "assets/js/25.3811ebcc.js",
    "revision": "097130b77d483d867a3e5bba6710d0b6"
  },
  {
    "url": "assets/js/26.104d8c57.js",
    "revision": "d8d3286c58e04aeccfbd7cc5aa126726"
  },
  {
    "url": "assets/js/27.c2f34bce.js",
    "revision": "19dd0a3f41bba07fae1d653574277ff9"
  },
  {
    "url": "assets/js/28.8eb8dda4.js",
    "revision": "6ae8709c41f4464fc7e448a89f5b61ef"
  },
  {
    "url": "assets/js/29.53b029c6.js",
    "revision": "204ece082792fc63122ca0dac498a222"
  },
  {
    "url": "assets/js/3.df01c7ec.js",
    "revision": "139f4c26ed644e6181b0bc10832f6e4b"
  },
  {
    "url": "assets/js/30.48264e98.js",
    "revision": "77f7dcf858bfb714af42051126d6e876"
  },
  {
    "url": "assets/js/31.de9f8b81.js",
    "revision": "cb80dc989464d596b072e340f0012742"
  },
  {
    "url": "assets/js/32.c0bbe7ef.js",
    "revision": "03075a50e894c9e2598a2576565f1b8a"
  },
  {
    "url": "assets/js/33.955bc52c.js",
    "revision": "b9f2a651082149219c6e12c77165db81"
  },
  {
    "url": "assets/js/34.9f41450b.js",
    "revision": "db92aa8d34f00c5380316afaa69808d2"
  },
  {
    "url": "assets/js/35.fb4c1093.js",
    "revision": "93dc6d285c4f7fb0811fb5581572eb74"
  },
  {
    "url": "assets/js/36.5face0fa.js",
    "revision": "9b5188c1f66b4e7ceee238161eecbb5f"
  },
  {
    "url": "assets/js/37.4245d4f2.js",
    "revision": "4597f11e644f4a441e990582d687fd95"
  },
  {
    "url": "assets/js/38.5773ecd9.js",
    "revision": "6855058cac39ef1155c5c15eebb76d67"
  },
  {
    "url": "assets/js/39.ac41d6ef.js",
    "revision": "2808cdbffa501b0a2f9d500f914208c6"
  },
  {
    "url": "assets/js/4.640c55ae.js",
    "revision": "9dd55dd66166dbb7eb3f08d7a2fce70b"
  },
  {
    "url": "assets/js/40.27c4c74c.js",
    "revision": "ac08981dd44e55690f629bf1c293d85d"
  },
  {
    "url": "assets/js/41.7e468935.js",
    "revision": "7a3b4ee29078b4029940cd201c469fc1"
  },
  {
    "url": "assets/js/42.c0c0f39f.js",
    "revision": "69d7facc13c200005d59aa0fead14092"
  },
  {
    "url": "assets/js/43.345b1608.js",
    "revision": "9535d1d24fc06770b7d3a5867cd0a70a"
  },
  {
    "url": "assets/js/44.5272665e.js",
    "revision": "48f72397b348326aa03b18fe16ce155a"
  },
  {
    "url": "assets/js/45.5ba8e9d5.js",
    "revision": "f452933a5afc2953ec321de02a64e5c9"
  },
  {
    "url": "assets/js/46.16cce7c2.js",
    "revision": "bf57cc3fcace6fc11eecfc1e06e0c999"
  },
  {
    "url": "assets/js/47.e2f08d03.js",
    "revision": "366332f3fe948d1d40c3d78b7cc31b49"
  },
  {
    "url": "assets/js/48.121100ac.js",
    "revision": "1fa753681c2e674bf8b2c64658a7c1ea"
  },
  {
    "url": "assets/js/49.9119c283.js",
    "revision": "6c55d37698e0bd5feaa00c19827c79d8"
  },
  {
    "url": "assets/js/5.a6150783.js",
    "revision": "99ef374ffdf7143927342c245787ba58"
  },
  {
    "url": "assets/js/50.70917303.js",
    "revision": "916cee327f79649450ce7cafc12269b3"
  },
  {
    "url": "assets/js/6.630ce0a3.js",
    "revision": "67e52adaaf4ce67378fac8b527e790ff"
  },
  {
    "url": "assets/js/7.6edda639.js",
    "revision": "77784c844edac19fde9600d332ce8015"
  },
  {
    "url": "assets/js/9.38dc1bf3.js",
    "revision": "7a65cfeadff6a5ab264809d2b0666d9d"
  },
  {
    "url": "assets/js/app.6675e6f6.js",
    "revision": "9b270acc0df7e212e02ad903837605bc"
  },
  {
    "url": "authors/index.html",
    "revision": "6ab1dd967e79bbc9574fc1921ded11cc"
  },
  {
    "url": "authors/rdbartram_large.jpg",
    "revision": "07f714171635cde7703118fcb3fc5b77"
  },
  {
    "url": "authors/rdbartram_small.jpg",
    "revision": "17f60f1eed639062572395f6579aad5a"
  },
  {
    "url": "authors/rdbartram.html",
    "revision": "078ab5745bc4b78f5efa9d5adebc7335"
  },
  {
    "url": "categories/azure.html",
    "revision": "e0bc1fcccb67a9378a062739f492c41f"
  },
  {
    "url": "categories/azuredevops.html",
    "revision": "1de08c0ac07bb326658688722ee23148"
  },
  {
    "url": "categories/dsc.html",
    "revision": "0868b6696f588732ac3876022279bc74"
  },
  {
    "url": "categories/index.html",
    "revision": "8597e6fce22d0770f1011a9ded0781b1"
  },
  {
    "url": "categories/pester.html",
    "revision": "373c48e8607b47199213d15d808c1089"
  },
  {
    "url": "categories/powershell.html",
    "revision": "3b0787e5968b7f0b631c43035409b9f7"
  },
  {
    "url": "categories/twss.html",
    "revision": "d9613fd53afcf544cc3af63c42fd4ae8"
  },
  {
    "url": "categories/updates.html",
    "revision": "5433fd8147cff20d4d635bd0787ace14"
  },
  {
    "url": "contact/index.html",
    "revision": "96f5626a9e0bea427b94a11de9d7e3e2"
  },
  {
    "url": "dftai-logo.png",
    "revision": "7bf4504b1507d8ead58705f737b263a1"
  },
  {
    "url": "dftai-logo@2x.png",
    "revision": "9999963bfee35479ebb0ec1842ca8bbc"
  },
  {
    "url": "fallback.png",
    "revision": "b7f4c3a771dd409f7b685d0872822c68"
  },
  {
    "url": "favicon/android-chrome-192x192.png",
    "revision": "b97fa47796f9599bc27f6b361bedfcb7"
  },
  {
    "url": "favicon/android-chrome-512x512.png",
    "revision": "9b286cc7da3d0a1886712f233615b4b3"
  },
  {
    "url": "favicon/android-icon-144x144.png",
    "revision": "f87ad43400405245d49ea603030fd4ca"
  },
  {
    "url": "favicon/android-icon-192x192.png",
    "revision": "b97fa47796f9599bc27f6b361bedfcb7"
  },
  {
    "url": "favicon/android-icon-36x36.png",
    "revision": "0f1fa6480dd58f686cf0a4f857d3bc40"
  },
  {
    "url": "favicon/android-icon-48x48.png",
    "revision": "0cf227128d72fea3520a6bc4dd7acd6c"
  },
  {
    "url": "favicon/android-icon-72x72.png",
    "revision": "8f37c352bc5d09c1837ca067334e0da5"
  },
  {
    "url": "favicon/android-icon-96x96.png",
    "revision": "dd1686aeae0c2daa59958c1244b75bc3"
  },
  {
    "url": "favicon/apple-icon-114x114.png",
    "revision": "b7f4c3a771dd409f7b685d0872822c68"
  },
  {
    "url": "favicon/apple-icon-120x120.png",
    "revision": "8eea6f1a1e00d7d2eae6f3ffb659534d"
  },
  {
    "url": "favicon/apple-icon-144x144.png",
    "revision": "f87ad43400405245d49ea603030fd4ca"
  },
  {
    "url": "favicon/apple-icon-152x152.png",
    "revision": "c0ffba4f63ff5618cf031a84aa136565"
  },
  {
    "url": "favicon/apple-icon-180x180.png",
    "revision": "e39202dd3a829ff8bf524ace09e7d0c2"
  },
  {
    "url": "favicon/apple-icon-57x57.png",
    "revision": "63f615bb4cd0ea3559c40528e08f106f"
  },
  {
    "url": "favicon/apple-icon-60x60.png",
    "revision": "749e1021d0db94c1a1c313d14f1ff636"
  },
  {
    "url": "favicon/apple-icon-72x72.png",
    "revision": "8f37c352bc5d09c1837ca067334e0da5"
  },
  {
    "url": "favicon/apple-icon-76x76.png",
    "revision": "9e864805401a466e65419b1c17357db5"
  },
  {
    "url": "favicon/apple-icon-precomposed.png",
    "revision": "b97fa47796f9599bc27f6b361bedfcb7"
  },
  {
    "url": "favicon/apple-icon.png",
    "revision": "b97fa47796f9599bc27f6b361bedfcb7"
  },
  {
    "url": "favicon/apple-touch-icon-120x120.png",
    "revision": "8eea6f1a1e00d7d2eae6f3ffb659534d"
  },
  {
    "url": "favicon/apple-touch-icon-152x152.png",
    "revision": "c0ffba4f63ff5618cf031a84aa136565"
  },
  {
    "url": "favicon/apple-touch-icon-180x180.png",
    "revision": "e39202dd3a829ff8bf524ace09e7d0c2"
  },
  {
    "url": "favicon/apple-touch-icon-60x60.png",
    "revision": "749e1021d0db94c1a1c313d14f1ff636"
  },
  {
    "url": "favicon/apple-touch-icon-76x76.png",
    "revision": "9e864805401a466e65419b1c17357db5"
  },
  {
    "url": "favicon/apple-touch-icon.png",
    "revision": "e39202dd3a829ff8bf524ace09e7d0c2"
  },
  {
    "url": "favicon/favicon-16x16.png",
    "revision": "e0e719d08e88967e69e193aa6bbc7a78"
  },
  {
    "url": "favicon/favicon-32x32.png",
    "revision": "6e45e801eeefcd30e10299aa5d4c20c1"
  },
  {
    "url": "favicon/favicon-96x96.png",
    "revision": "dd1686aeae0c2daa59958c1244b75bc3"
  },
  {
    "url": "favicon/ms-icon-144x144.png",
    "revision": "f87ad43400405245d49ea603030fd4ca"
  },
  {
    "url": "favicon/ms-icon-150x150.png",
    "revision": "5c62a264b3ec4e60fa1d3f3bcb26511f"
  },
  {
    "url": "favicon/ms-icon-310x310.png",
    "revision": "440b5c19df150598576f98c898e63104"
  },
  {
    "url": "favicon/ms-icon-70x70.png",
    "revision": "e230050b0237590dfdb44b33435ebbfd"
  },
  {
    "url": "favicon/mstile-150x150.png",
    "revision": "5c62a264b3ec4e60fa1d3f3bcb26511f"
  },
  {
    "url": "favicon/safari-pinned-tab.svg",
    "revision": "a4e5fa9eecc42bcb296acdcf3a97b932"
  },
  {
    "url": "index.html",
    "revision": "fabbfe7081a89fa446d742db2ef2a3d6"
  },
  {
    "url": "OneSignalSDKUpdaterWorker.js",
    "revision": "65fbe88537808e8f4870455ff347a7b5"
  },
  {
    "url": "OneSignalSDKWorker.js",
    "revision": "65fbe88537808e8f4870455ff347a7b5"
  },
  {
    "url": "posts/azure/azure-functions-cool-jazz.html",
    "revision": "08e2c6a10f8a99152ae6c623b5353e5a"
  },
  {
    "url": "posts/dsc/automating-dsc-partial-configuration-name-updates.html",
    "revision": "3e6a4fb688a67d96bae284284c6d5913"
  },
  {
    "url": "posts/dsc/updating-dsc-confignames-pull-server.html",
    "revision": "e149f15600c7bb6f1ca3fdc5a0c717a4"
  },
  {
    "url": "posts/index.html",
    "revision": "f4ac3d917fcb2f449ab6eda3972baee2"
  },
  {
    "url": "posts/twss/continueforeach.html",
    "revision": "246aa520c73ffc8a69d5d3205cd2dcdc"
  },
  {
    "url": "posts/twss/if-it-aint-bolted-down-throw-it-out.html",
    "revision": "4673a427d2ea81395cdf645d2ae4356a"
  },
  {
    "url": "posts/twss/ps-gui-future-1.html",
    "revision": "61e57e710927b37bd67b6b24796a41f0"
  },
  {
    "url": "posts/twss/ps-gui-future-2.html",
    "revision": "a65b0025a335a9f6c6c3119749d2d8af"
  },
  {
    "url": "posts/twss/ps-gui-future-3.html",
    "revision": "3eea498d844e130da31d66cdc9b28a1d"
  },
  {
    "url": "posts/updates/hello-world.html",
    "revision": "e36743a789fc89d78ef53860a8a764fe"
  },
  {
    "url": "privacy/index.html",
    "revision": "1931cdb277377a8579c35761e7a034a4"
  },
  {
    "url": "share/dftai-image-share.png",
    "revision": "833121e32836ae0ee9d7c4ba57bbb6b0"
  },
  {
    "url": "watermark-logo.png",
    "revision": "589b7de56669a5c0b9a2890a6e873966"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
