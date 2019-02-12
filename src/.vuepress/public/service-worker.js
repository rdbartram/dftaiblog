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
    "revision": "ec27b8e02cefdd3c79378c19fecdcd40"
  },
  {
    "url": "abduction.svg",
    "revision": "ef6dc31a4fa8384ba0cb717e83863a6e"
  },
  {
    "url": "about/index.html",
    "revision": "0132bbd049e9c4e37e79bb94e0f03e0b"
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
    "url": "assets/img/dscstatus-1024x560.4e318981.png",
    "revision": "4e3189810965d077e5914ce5b142fb03"
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
    "url": "assets/img/startdscpath-1024x542.67b29446.png",
    "revision": "67b294464b4b14a9ea111e09590039dd"
  },
  {
    "url": "assets/img/startdscuse-1024x525.70b53755.png",
    "revision": "70b53755177a3e381f5899da0ebaa09c"
  },
  {
    "url": "assets/img/timer.5d30edff.jpg",
    "revision": "5d30edffeee029c92eb730b3c0db554d"
  },
  {
    "url": "assets/js/1.37909e61.js",
    "revision": "fa95fb9d9b060cb3a1f7d278306ee092"
  },
  {
    "url": "assets/js/10.ba547f29.js",
    "revision": "ba1952608fc76c34a73faa37b955f150"
  },
  {
    "url": "assets/js/11.f590e029.js",
    "revision": "8a310ae5b310039c1dbe2b33e851b571"
  },
  {
    "url": "assets/js/12.57124656.js",
    "revision": "2488df16c3047d1870ea09e779b4f5bf"
  },
  {
    "url": "assets/js/13.1c3fc4af.js",
    "revision": "8ecdf66dc3d7d77e7f5cc76f0e61c350"
  },
  {
    "url": "assets/js/14.1bf6ac46.js",
    "revision": "1b71a7c8558d1f2023153d9825ba43ee"
  },
  {
    "url": "assets/js/15.be78831f.js",
    "revision": "67df3da36d6dd22eb23cc90426d6767c"
  },
  {
    "url": "assets/js/16.04fb2fe2.js",
    "revision": "b5703b21f733d687472d26552b772276"
  },
  {
    "url": "assets/js/17.1bff5a14.js",
    "revision": "5b9ec99462437015abe68bc0d7968846"
  },
  {
    "url": "assets/js/18.295fb5db.js",
    "revision": "861d0e1751b0368c08f2cd34155a5286"
  },
  {
    "url": "assets/js/19.a02bbbc3.js",
    "revision": "7f30f7458ae217d40fab9cf51254362f"
  },
  {
    "url": "assets/js/2.316c5fc8.js",
    "revision": "98efb65521bf8b150f77743339378828"
  },
  {
    "url": "assets/js/20.464a70d8.js",
    "revision": "604c4fb9faf178133d164bc12301f34a"
  },
  {
    "url": "assets/js/21.63b5cdfc.js",
    "revision": "064e1f82b3161affb68fef6fdbefd4a4"
  },
  {
    "url": "assets/js/22.346308e1.js",
    "revision": "312f7df8e4c2243cc2c30e226095f4fa"
  },
  {
    "url": "assets/js/23.1c2a1f79.js",
    "revision": "4e390497193b0199d9f4015177f612ae"
  },
  {
    "url": "assets/js/24.8262064f.js",
    "revision": "f1b7f96571044254a8d1ed481a54d8e2"
  },
  {
    "url": "assets/js/25.2062a773.js",
    "revision": "79332ea6e76963b7afda4cd469f6a7d2"
  },
  {
    "url": "assets/js/26.beca637f.js",
    "revision": "6b298bc75080dc6ece88220a2fb5876c"
  },
  {
    "url": "assets/js/27.f0c7481f.js",
    "revision": "6dbf5613ac9723453adfe08c2f2c12d1"
  },
  {
    "url": "assets/js/28.bfc2e251.js",
    "revision": "deaea7da12ec45bc8ed4aafeb4fd24ea"
  },
  {
    "url": "assets/js/29.74434c81.js",
    "revision": "921f935c171b7b20f2e1e1c1c48d581b"
  },
  {
    "url": "assets/js/3.3bf79b34.js",
    "revision": "1da1172ad1ebc89922f065a04c440a7c"
  },
  {
    "url": "assets/js/30.718edd5a.js",
    "revision": "59a119e78b888e6f06444adecc0199f4"
  },
  {
    "url": "assets/js/31.d1c13e6c.js",
    "revision": "0622370f271138f2010364177f0c6969"
  },
  {
    "url": "assets/js/32.cb0878f9.js",
    "revision": "dad5c025fd20d71f89010021cb17f647"
  },
  {
    "url": "assets/js/33.cb148f7f.js",
    "revision": "988f42ea56742ce8a6ea745a486cdcf7"
  },
  {
    "url": "assets/js/34.56ea37cc.js",
    "revision": "1b4323d444246be5c528d844bb4b7a25"
  },
  {
    "url": "assets/js/35.a4fd52b0.js",
    "revision": "9b985451a40ada79084e4217ac61ffb2"
  },
  {
    "url": "assets/js/36.7a86ce8a.js",
    "revision": "f0ece3c139241adc42e8eddd380d8eb2"
  },
  {
    "url": "assets/js/37.8af8f2f1.js",
    "revision": "e92c2358f2d6dbbbd55db9f9b742d70b"
  },
  {
    "url": "assets/js/38.7dee1495.js",
    "revision": "9a78af38a8b8b5ffa2df86aeb02a9349"
  },
  {
    "url": "assets/js/39.d5da7a09.js",
    "revision": "31147c3adbc572e4b16cdcbfb3a59918"
  },
  {
    "url": "assets/js/4.1525f414.js",
    "revision": "9c1e62f30227ff0ec763a7767d5f6dd0"
  },
  {
    "url": "assets/js/40.b3fb2089.js",
    "revision": "2db8cb9e4920e69679aa7f4dd19b79b7"
  },
  {
    "url": "assets/js/41.f3c4a8a5.js",
    "revision": "8fb25f428ba349b35d9ef21bc364c774"
  },
  {
    "url": "assets/js/42.6c7044b4.js",
    "revision": "07ecb642aab6ffe73b58f1bfc2a3e39e"
  },
  {
    "url": "assets/js/43.f65ccfc2.js",
    "revision": "21e6b5cf6049d3ed4f355c16760c9926"
  },
  {
    "url": "assets/js/44.6834a46c.js",
    "revision": "ffe75da55148395113bc1321376ad07e"
  },
  {
    "url": "assets/js/45.53ea8e38.js",
    "revision": "209e5ff140a7a3d10355c73e69effa78"
  },
  {
    "url": "assets/js/46.6e803524.js",
    "revision": "85620ddd4eb895b3cba460b6cb017ce6"
  },
  {
    "url": "assets/js/47.084094e0.js",
    "revision": "5da50973537072aa2e173314b015acbf"
  },
  {
    "url": "assets/js/48.90758d1b.js",
    "revision": "b8c4cb0c65b411fe9fde04e2e907d0d4"
  },
  {
    "url": "assets/js/49.ff478215.js",
    "revision": "afdd2533b861cde037b14f7af16007c4"
  },
  {
    "url": "assets/js/5.441e0edd.js",
    "revision": "bdd3241cde53eee5b68740a4cf7cf592"
  },
  {
    "url": "assets/js/50.74ae7d5b.js",
    "revision": "889c352cea350dccfa0d7566ff179ccb"
  },
  {
    "url": "assets/js/51.812cf2a0.js",
    "revision": "73e0fee0ba99e014431dd13140bb8742"
  },
  {
    "url": "assets/js/6.64d8761b.js",
    "revision": "dd040c74aeeb4007ec4acd3c36c3eab5"
  },
  {
    "url": "assets/js/7.568aac9a.js",
    "revision": "e55a74963bcbe4dc6221b37d54b8c4d4"
  },
  {
    "url": "assets/js/9.14c169dc.js",
    "revision": "8be9f59605d0e6d468003891c5b6c644"
  },
  {
    "url": "assets/js/app.a7e57d55.js",
    "revision": "0a881e2a1d55b2f25cd6014bbfae0198"
  },
  {
    "url": "authors/index.html",
    "revision": "c67f8c22f522948d54f6a9d96325cf50"
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
    "revision": "dddde9c4c62c6cc6f57a53b365f40429"
  },
  {
    "url": "categories/azure.html",
    "revision": "b64b9ee58add87bac00a84d6fa93bc53"
  },
  {
    "url": "categories/azuredevops.html",
    "revision": "dc6259783cb747bcb2e3fa23dbbacff6"
  },
  {
    "url": "categories/dsc.html",
    "revision": "e9921dd5ae54a555cb0f17d0f3ab7da2"
  },
  {
    "url": "categories/index.html",
    "revision": "68728411856b9f744e13e934619ad033"
  },
  {
    "url": "categories/pester.html",
    "revision": "b755ca3e27f775c13aa5705978898ae9"
  },
  {
    "url": "categories/powershell.html",
    "revision": "d1f967937d8f323f08671f8eec163661"
  },
  {
    "url": "categories/twss.html",
    "revision": "a45ce7b267ff6057e861ec5c629a6df5"
  },
  {
    "url": "categories/updates.html",
    "revision": "dc38e5537e1e749745e37ce192808aed"
  },
  {
    "url": "contact/index.html",
    "revision": "6a05e21daad7f7064c1d8a05b686e939"
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
    "url": "images/28dsc_twitter.png",
    "revision": "5aaaf89fad2fa9f92703dfb0f670eb8c"
  },
  {
    "url": "images/28dsc,w_320.png",
    "revision": "cda39a02d2e3341782e276035ace40b1"
  },
  {
    "url": "images/28dsc,w_427.png",
    "revision": "32c4c3c5d7ed04060f712345b65c31df"
  },
  {
    "url": "images/28dsc,w_524.png",
    "revision": "e688e336d153511e3d4c9c06717a9ea7"
  },
  {
    "url": "images/28dsc,w_680.png",
    "revision": "338df48609594ca01b0157aa5bd4a1ee"
  },
  {
    "url": "images/28dsc.png",
    "revision": "338df48609594ca01b0157aa5bd4a1ee"
  },
  {
    "url": "index.html",
    "revision": "95c8470f1295a498daa9e2a1c942837c"
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
    "revision": "30163c95c785d38520e4dd766b63623d"
  },
  {
    "url": "posts/dsc/28-days-dsc-1.html",
    "revision": "f26379cbeccdfbfcf539dc7f857e5569"
  },
  {
    "url": "posts/dsc/automating-dsc-partial-configuration-name-updates.html",
    "revision": "b8e7f3b75fe5d0134d711dc5492430af"
  },
  {
    "url": "posts/dsc/updating-dsc-confignames-pull-server.html",
    "revision": "6fd993fd2379b3909122946ed118a379"
  },
  {
    "url": "posts/index.html",
    "revision": "91a30351e31af9a383dc94724b62c876"
  },
  {
    "url": "posts/twss/continueforeach.html",
    "revision": "42c1c770be9f60f928c87f4afb419e62"
  },
  {
    "url": "posts/twss/if-it-aint-bolted-down-throw-it-out.html",
    "revision": "142ab41a75c6642d00cc477e32222f02"
  },
  {
    "url": "posts/twss/ps-gui-future-1.html",
    "revision": "7efa877741c78b62ce2399b79dcec5e0"
  },
  {
    "url": "posts/twss/ps-gui-future-2.html",
    "revision": "e9d871701718c7c9ac61c6643e7f3e6d"
  },
  {
    "url": "posts/twss/ps-gui-future-3.html",
    "revision": "0e8547126a86060bff5b000ff1a3551a"
  },
  {
    "url": "posts/updates/hello-world.html",
    "revision": "444f925f9d459d90267fef8084fa5cbd"
  },
  {
    "url": "privacy/index.html",
    "revision": "286643e0d8c0fa67d8deb3a35ab4ce86"
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
